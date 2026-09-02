#include "SheepMovementStrategy.h"
#include "PathFinder.h"

std::vector<Position> SheepMovementStrategy::getPossibleMoves(
    const Animal& animal,
    const GameState& gameState
) {
    std::vector<Grass*> grassPositions;

    for (Grass* g : gameState.getGrass()) {
        if (g->isAlive()) {
            grassPositions.push_back(g);
        }
    }

    std::vector<Position> grassPositionsList;

    for (Grass* g : grassPositions) {
        grassPositionsList.push_back(g->getPosition());
    }

    std::vector<std::vector<int>> distance =
        PathFinder::calculateDistances(
            gameState.getBoard(),
            grassPositionsList
        );

    Position current = animal.getPosition();

    const Cell& cell =
        gameState.getBoard().getCell(current.row, current.col);

    // Sheep already on grass stays there
    if (cell.hasGrass()) {
        return {};
    }

    int dr[] = {-1, -1, -1, 0, 0, 1, 1, 1};
    int dc[] = {-1, 0, 1, -1, 1, -1, 0, 1};

    std::vector<Position> bestMoves;

    int bestDistance = 1e9;

    for (int i = 0; i < 8; i++) {

        int newRow = current.row + dr[i];
        int newCol = current.col + dc[i];

        if (!gameState.getBoard().isValidPosition(newRow, newCol))
            continue;

        int currentDistance = distance[newRow][newCol];

        if (currentDistance == -1)
            continue;

        if (currentDistance < bestDistance) {

            bestDistance = currentDistance;

            bestMoves.clear();

            bestMoves.push_back(
                Position(newRow, newCol)
            );
        }
        else if (currentDistance == bestDistance) {

            bestMoves.push_back(
                Position(newRow, newCol)
            );
        }
    }

    return bestMoves;
}