#include "Board.h"

Board::Board(int rows, int columns)
    : rows(rows), columns(columns) {

    cells.reserve(rows);

    for (int i = 0; i < rows; i++) {
        std::vector<Cell> row;

        for (int j = 0; j < columns; j++) {
            row.push_back(Cell(Position(i, j)));
        }

        cells.push_back(row);
    }
}

int Board::getRows() const {
    return rows;
}

int Board::getColumns() const {
    return columns;
}

Cell& Board::getCell(int row, int col) {
    return cells[row][col];
}

const Cell& Board::getCell(int row, int col) const {
    return cells[row][col];
}

bool Board::isValidPosition(int row, int col) const {
    return row >= 0 && row < rows &&
           col >= 0 && col < columns;
}

void Board::moveSheep(Sheep* sheep, Position newPosition) {

    if (sheep == nullptr)
        return;

    if (!isValidPosition(newPosition.row, newPosition.col))
        return;

    Position oldPosition = sheep->getPosition();

    Cell& oldCell = getCell(oldPosition.row, oldPosition.col);
    Cell& newCell = getCell(newPosition.row, newPosition.col);

    // Another sheep is already there
    if (newCell.hasSheep())
        return;

    oldCell.setSheep(nullptr);

    sheep->setPosition(newPosition);

    newCell.setSheep(sheep);
}

void Board::moveWolf(Wolf* wolf, Position newPosition) {

    if (wolf == nullptr)
        return;

    if (!isValidPosition(newPosition.row, newPosition.col))
        return;

    Position oldPosition = wolf->getPosition();

    Cell& oldCell = getCell(oldPosition.row, oldPosition.col);
    Cell& newCell = getCell(newPosition.row, newPosition.col);

    // Another wolf is already there
    if (newCell.hasWolf())
        return;

    oldCell.setWolf(nullptr);

    wolf->setPosition(newPosition);

    newCell.setWolf(wolf);
}