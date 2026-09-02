#pragma once

#include "Animal.h"

class Sheep : public Animal {
public:
    Sheep(int id, Position position);

    void eatGrass();
    bool canReproduce() const;
};