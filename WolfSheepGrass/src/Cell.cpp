#include "Cell.h"

Cell::Cell(Position position)
    : position(position),
      grass(nullptr),
      sheep(nullptr),
      wolf(nullptr) {
}

Position Cell::getPosition() const {
    return position;
}

Grass* Cell::getGrass() const {
    return grass;
}

Sheep* Cell::getSheep() const {
    return sheep;
}

Wolf* Cell::getWolf() const {
    return wolf;
}

void Cell::setGrass(Grass* grass) {
    this->grass = grass;
}

void Cell::setSheep(Sheep* sheep) {
    this->sheep = sheep;
}

void Cell::setWolf(Wolf* wolf) {
    this->wolf = wolf;
}

bool Cell::hasGrass() const {
    return grass != nullptr;
}

bool Cell::hasSheep() const {
    return sheep != nullptr;
}

bool Cell::hasWolf() const {
    return wolf != nullptr;
}