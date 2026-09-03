#include "SimulationEngine.h"

#include <algorithm>
#include <random>

struct MovementIntent {
    Animal* animal;
    Position target;
};

long long getPositionKey(Position position) {
    return ((long long)position.row << 32)
           | (unsigned int)position.col;
}

std::mt19937& getRandomGenerator() {
    static std::random_device rd;
    static std::mt19937 generator(rd());

    return generator;
}

SimulationEngine::SimulationEngine() {
}

Position SimulationEngine::chooseRandomMove( const std::vector<Position>& possibleMoves){
    if (possibleMoves.empty()) {
        return Position(-1, -1);
    }

    std::uniform_int_distribution<int> distribution(
        0,
        possibleMoves.size() - 1
    );

    return possibleMoves[
        distribution(getRandomGenerator())
    ];
}

void SimulationEngine::tick(GameState& gameState) {
    moveAnimals(gameState);
    resolveInteractions(gameState);
    reproduceSheep(gameState);
    updateSurvival(gameState);
    removeDeadAnimals(gameState);

    gameState.nextDay();

    checkGameStatus(gameState);
}

void SimulationEngine::moveAnimals(GameState& gameState) {

    SheepMovementStrategy sheepStrategy;
    WolfMovementStrategy wolfStrategy;

    std::unordered_set<long long> sheepOccupied;
    std::unordered_set<long long> wolfOccupied;

    // --------------------------------
    // Store positions at beginning
    // of the day
    // --------------------------------

    for (Sheep* sheep : gameState.getSheep()) {

        if (sheep != nullptr && sheep->isAlive()) {

            sheepOccupied.insert(
                getPositionKey(
                    sheep->getPosition()
                )
            );
        }
    }

    for (Wolf* wolf : gameState.getWolves()) {

        if (wolf != nullptr && wolf->isAlive()) {

            wolfOccupied.insert(
                getPositionKey(
                    wolf->getPosition()
                )
            );
        }
    }

    // --------------------------------
    // Generate movement intents
    // --------------------------------

    std::vector<MovementIntent> sheepIntents;
    std::vector<MovementIntent> wolfIntents;

    // --------------------------------
    // Sheep
    // --------------------------------

    for (Sheep* sheep : gameState.getSheep()) {

        if (sheep == nullptr || !sheep->isAlive())
            continue;

        std::vector<Position> possibleMoves =
            sheepStrategy.getPossibleMoves(
                *sheep,
                gameState
            );

        std::vector<Position> validMoves;

        for (Position position : possibleMoves) {

            long long key =
                getPositionKey(position);

            // Cannot move onto another sheep
            if (!sheepOccupied.count(key)) {

                validMoves.push_back(position);
            }
        }

        if (!validMoves.empty()) {

            Position target =
                chooseRandomMove(validMoves);

            sheepIntents.push_back({
                sheep,
                target
            });
        }
    }

    // --------------------------------
    // Wolves
    // --------------------------------

    for (Wolf* wolf : gameState.getWolves()) {

        if (wolf == nullptr || !wolf->isAlive())
            continue;

        std::vector<Position> possibleMoves =
            wolfStrategy.getPossibleMoves(
                *wolf,
                gameState
            );

        std::vector<Position> validMoves;

        for (Position position : possibleMoves) {

            long long key =
                getPositionKey(position);

            // Cannot move onto another wolf
            if (!wolfOccupied.count(key)) {

                validMoves.push_back(position);
            }
        }

        if (!validMoves.empty()) {

            Position target =
                chooseRandomMove(validMoves);

            wolfIntents.push_back({
                wolf,
                target
            });
        }
    }

    // --------------------------------
    // Resolve sheep conflicts
    // --------------------------------

    std::unordered_set<long long> claimedSheepCells;

    for (MovementIntent& intent : sheepIntents) {

        long long key =
            getPositionKey(intent.target);

        if (claimedSheepCells.count(key))
            continue;

        claimedSheepCells.insert(key);

        Sheep* sheep =
            static_cast<Sheep*>(intent.animal);

        gameState.getBoard().moveSheep(
            sheep,
            intent.target
        );
    }

    // --------------------------------
    // Resolve wolf conflicts
    // --------------------------------

    std::unordered_set<long long> claimedWolfCells;

    for (MovementIntent& intent : wolfIntents) {

        long long key =
            getPositionKey(intent.target);

        if (claimedWolfCells.count(key))
            continue;

        claimedWolfCells.insert(key);

        Wolf* wolf =
            static_cast<Wolf*>(intent.animal);

        gameState.getBoard().moveWolf(
            wolf,
            intent.target
        );
    }
}

void SimulationEngine::resolveInteractions(GameState& gameState) {

    Board& board = gameState.getBoard();

    for (int row = 0; row < board.getRows(); row++) {

        for (int col = 0; col < board.getColumns(); col++) {

            Cell& cell =
                board.getCell(row, col);

            Sheep* sheep =
                cell.getSheep();

            Wolf* wolf =
                cell.getWolf();

            Grass* grass =
                cell.getGrass();

            // --------------------------------
            // Wolf eats Sheep first
            // --------------------------------

            if (wolf != nullptr &&
                sheep != nullptr &&
                sheep->isAlive()) {

                wolf->eatSheep();

                sheep->kill();

                cell.setSheep(nullptr);
            }

            // --------------------------------
            // Sheep eats Grass
            // --------------------------------

            if (sheep != nullptr &&
                sheep->isAlive() &&
                grass != nullptr) {

                sheep->eatGrass();
            }
        }
    }
}

void SimulationEngine::reproduceSheep(GameState& gameState) {

    Board& board =
        gameState.getBoard();

    // Snapshot so newborn sheep
    // don't reproduce on the same day
    std::vector<Sheep*> sheepSnapshot =
        gameState.getSheep();

    for (Sheep* sheep : sheepSnapshot) {

        if (sheep == nullptr ||
            !sheep->isAlive()) {

            continue;
        }

        Position position =
            sheep->getPosition();

        Cell& currentCell =
            board.getCell(
                position.row,
                position.col
            );

        // Sheep reproduces only on grass
        if (!currentCell.hasGrass())
            continue;

        std::vector<Position> possiblePositions;

        // Check all 8 adjacent cells
        for (int dr = -1; dr <= 1; dr++) {

            for (int dc = -1; dc <= 1; dc++) {

                if (dr == 0 && dc == 0)
                    continue;

                int newRow =
                    position.row + dr;

                int newCol =
                    position.col + dc;

                if (!board.isValidPosition(
                        newRow,
                        newCol)) {

                    continue;
                }

                Cell& newCell =
                    board.getCell(
                        newRow,
                        newCol
                    );

                // Only one sheep per cell
                if (!newCell.hasSheep()) {

                    possiblePositions.push_back(
                        Position(
                            newRow,
                            newCol
                        )
                    );
                }
            }
        }

        if (possiblePositions.empty())
            continue;

        Position newPosition =
            chooseRandomMove(
                possiblePositions
            );

        int newId =
            gameState.getNextSheepId();

        Sheep* newSheep =
            new Sheep(
                newId,
                newPosition
            );

        gameState.addSheep(newSheep);
    }
}

void SimulationEngine::updateSurvival(GameState& gameState) {

    // --------------------------------
    // Sheep
    // --------------------------------

    for (Sheep* sheep : gameState.getSheep()) {

        if (sheep == nullptr ||
            !sheep->isAlive()) {

            continue;
        }

        if (!sheep->wasFedToday()) {

            sheep->increaseHunger();
        }

        if (sheep->shouldDie()) {

            sheep->kill();
        }

        sheep->resetFedToday();
    }

    // --------------------------------
    // Wolves
    // --------------------------------

    for (Wolf* wolf : gameState.getWolves()) {

        if (wolf == nullptr ||
            !wolf->isAlive()) {

            continue;
        }

        if (!wolf->wasFedToday()) {

            wolf->increaseHunger();
        }

        if (wolf->shouldDie()) {

            wolf->kill();
        }

        wolf->resetFedToday();
    }
}

void SimulationEngine::removeDeadAnimals( GameState& gameState) {

    Board& board =
        gameState.getBoard();

    // --------------------------------
    // Remove dead sheep
    // --------------------------------

    auto& sheep =
        gameState.getSheep();

    for (auto it = sheep.begin();
         it != sheep.end();) {

        Sheep* currentSheep = *it;

        if (!currentSheep->isAlive()) {

            Position position =
                currentSheep->getPosition();

            Cell& cell =
                board.getCell(
                    position.row,
                    position.col
                );

            if (cell.getSheep() ==
                currentSheep) {

                cell.setSheep(nullptr);
            }

            delete currentSheep;

            it = sheep.erase(it);
        }
        else {

            ++it;
        }
    }

    // --------------------------------
    // Remove dead wolves
    // --------------------------------

    auto& wolves =
        gameState.getWolves();

    for (auto it = wolves.begin();
         it != wolves.end();) {

        Wolf* currentWolf = *it;

        if (!currentWolf->isAlive()) {

            Position position =
                currentWolf->getPosition();

            Cell& cell =
                board.getCell(
                    position.row,
                    position.col
                );

            if (cell.getWolf() ==
                currentWolf) {

                cell.setWolf(nullptr);
            }

            delete currentWolf;

            it = wolves.erase(it);
        }
        else {

            ++it;
        }
    }
}

void SimulationEngine::checkGameStatus(GameState& gameState) {

    bool hasSheep = false;
    bool hasWolf = false;

    for (Sheep* sheep :
         gameState.getSheep()) {

        if (sheep != nullptr &&
            sheep->isAlive()) {

            hasSheep = true;
            break;
        }
    }

    for (Wolf* wolf :
         gameState.getWolves()) {

        if (wolf != nullptr &&
            wolf->isAlive()) {

            hasWolf = true;
            break;
        }
    }

    // No sheep
    if (!hasSheep) {

        gameState.setStatus(
            GameStatus::LOST
        );

        return;
    }

    // No wolves
    if (!hasWolf) {

        gameState.setStatus(
            GameStatus::LOST
        );

        return;
    }

    // Required number of days survived
    if (gameState.getCurrentDay() >=
        gameState.getMaxDays()) {

        gameState.setStatus(
            GameStatus::WON
        );

        return;
    }

    gameState.setStatus(
        GameStatus::RUNNING
    );
}