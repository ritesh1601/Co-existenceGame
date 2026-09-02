#ifndef SHEEP_MOVEMENT_STRATEGY_H
#define SHEEP_MOVEMENT_STRATEGY_H

#include "MovementStrategy.h"

class SheepMovementStrategy : public MovementStrategy {
public:
    std::vector<Position> getPossibleMoves(
        const Animal& animal,
        const GameState& gameState
    ) override;
};

#endif