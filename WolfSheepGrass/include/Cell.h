#ifndef CELL_H
#define CELL_H

#include "Position.h"
#include "Grass.h"
#include "Sheep.h"
#include "Wolf.h"

class Cell {
private:
    Position position;

    Grass* grass;
    Sheep* sheep;
    Wolf* wolf;

public:
    Cell(Position position);

    Position getPosition() const;

    Grass* getGrass() const;
    Sheep* getSheep() const;
    Wolf* getWolf() const;

    void setGrass(Grass* grass);
    void setSheep(Sheep* sheep);
    void setWolf(Wolf* wolf);

    bool hasGrass() const;
    bool hasSheep() const;
    bool hasWolf() const;
};

#endif