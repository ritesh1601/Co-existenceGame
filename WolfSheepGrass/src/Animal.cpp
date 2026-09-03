#include "Animal.h"

Animal::Animal(int id, Position position)
    : Entity(id, position),
      daysWithoutFood(0),
      fedToday(false) {
}

int Animal::getDaysWithoutFood() const {
    return daysWithoutFood;
}

void Animal::setDaysWithoutFood(int days) {
    daysWithoutFood = days;
}

void Animal::increaseHunger() {
    daysWithoutFood++;
}

void Animal::resetHunger() {
    daysWithoutFood = 0;
    fedToday = true;
}

bool Animal::wasFedToday() const {
    return fedToday;
}

void Animal::resetFedToday() {
    fedToday = false;
}

bool Animal::shouldDie() const {
    return daysWithoutFood > 3;
}
