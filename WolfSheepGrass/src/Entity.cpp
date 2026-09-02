#include "Entity.h"

Entity::Entity(int id, Position position)
    : id(id), position(position), alive(true) {}

int Entity::getId() const {
    return id;
}

Position Entity::getPosition() const {
    return position;
}

bool Entity::isAlive() const {
    return alive;
}

void Entity::setPosition(Position position) {
    this->position = position;
}

void Entity::kill() {
    alive = false;
}