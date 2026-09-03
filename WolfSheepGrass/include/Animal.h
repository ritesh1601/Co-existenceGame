#ifndef ANIMAL_H
#define ANIMAL_H

#include "Entity.h"

class Animal : public Entity {
protected:
    int daysWithoutFood;
    bool fedToday;

public:
    Animal(int id, Position position);

    int getDaysWithoutFood() const;

    void increaseHunger();
    void resetHunger();

    bool wasFedToday() const;
    void resetFedToday();
    void setDaysWithoutFood(int days);
    bool shouldDie() const;
};

#endif