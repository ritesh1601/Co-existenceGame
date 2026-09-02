#ifndef MOVEMENT_STRATEGY_H
#define MOVEMENT_STRATEGY_H

#include "GameState.h"
#include "Position.h"
#include "Animal.h"

#include <vector>

class MovementStrategy {
public:
    virtual std::vector<Position> getPossibleMoves(
        const Animal& animal,
        const GameState& gameState
    ) = 0;

    virtual ~MovementStrategy() = default;
};

#endif