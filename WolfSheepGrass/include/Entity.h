#pragma once

#include "Position.h"

class Entity {
protected:
    int id;
    Position position;
    bool alive;

public:
    Entity(int id, Position position);

    int getId() const;
    Position getPosition() const;
    bool isAlive() const;

    void setPosition(Position position);
    void kill();

    virtual ~Entity() = default;
};