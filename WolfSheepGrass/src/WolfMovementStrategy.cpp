#include "WolfMovementStrategy.h"
#include "PathFinder.h"

std::vector<Position> WolfMovementStrategy::getPossibleMoves(
    const Animal& animal,
    const GameState& gameState
) {
    std::vector<Position> sheepPositions;

    for (Sheep* s : gameState.getSheep()) {
        if (s->isAlive()) {
            sheepPositions.push_back(s->getPosition());
        }
    }

    std::vector<std::vector<int>> distance =
        PathFinder::calculateDistances(
            gameState.getBoard(),
            sheepPositions
        );

    Position current = animal.getPosition();

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