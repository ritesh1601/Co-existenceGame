#include "Wolf.h"

Wolf::Wolf(int id, Position position)
    : Animal(id, position) {}

void Wolf::eatSheep() {
    resetHunger();
}