#pragma once

#include "Animal.h"

class Wolf : public Animal {
public:
    Wolf(int id, Position position);

    void eatSheep();
};