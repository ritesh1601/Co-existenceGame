#include "Sheep.h"

Sheep::Sheep(int id, Position position)
    : Animal(id, position) {}

void Sheep::eatGrass() {
    resetHunger();
}

bool Sheep::canReproduce() const {
    return isAlive();
}