#ifndef POSITION_H
#define POSITION_H

class Position {
public:
    int row;
    int col;

    Position(int row = 0, int col = 0)
        : row(row), col(col) {}
};

#endif
