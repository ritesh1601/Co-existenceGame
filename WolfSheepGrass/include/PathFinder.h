#ifndef PATH_FINDER_H
#define PATH_FINDER_H

#include "Board.h"
#include "Position.h"

#include <vector>

class PathFinder {
public:
    static std::vector<std::vector<int>> calculateDistances(
        const Board& board,
        const std::vector<Position>& targets
    );
};

#endif