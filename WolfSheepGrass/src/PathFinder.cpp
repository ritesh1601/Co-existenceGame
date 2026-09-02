#include "PathFinder.h"

#include <queue>

std::vector<std::vector<int>> PathFinder::calculateDistances(
    const Board& board,
    const std::vector<Position>& targets
) {
    int rows = board.getRows();
    int columns = board.getColumns();

    std::vector<std::vector<int>> distance(
        rows,
        std::vector<int>(columns, -1)
    );

    std::queue<Position> q;

    // Put all targets into the queue
    for (const Position& target : targets) {
        distance[target.row][target.col] = 0;
        q.push(target);
    }

    // 8 possible directions
    int dr[] = {-1, -1, -1, 0, 0, 1, 1, 1};
    int dc[] = {-1, 0, 1, -1, 1, -1, 0, 1};

    while (!q.empty()) {

        Position current = q.front();
        q.pop();

        for (int i = 0; i < 8; i++) {

            int newRow = current.row + dr[i];
            int newCol = current.col + dc[i];

            if (!board.isValidPosition(newRow, newCol))
                continue;

            if (distance[newRow][newCol] != -1)
                continue;

            distance[newRow][newCol] =
                distance[current.row][current.col] + 1;

            q.push(Position(newRow, newCol));
        }
    }

    return distance;
}