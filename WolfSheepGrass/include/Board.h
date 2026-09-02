#ifndef BOARD_H
#define BOARD_H

#include "Cell.h"
#include <vector>

class Board {
private:
    int rows;
    int columns;
    std::vector<std::vector<Cell>> cells;

public:
    Board(int rows, int columns);

    int getRows() const;
    int getColumns() const;

    Cell& getCell(int row, int col);
    const Cell& getCell(int row, int col) const;

    bool isValidPosition(int row, int col) const;

    void moveSheep(Sheep* sheep, Position newPosition);
    void moveWolf(Wolf* wolf, Position newPosition);
};

#endif