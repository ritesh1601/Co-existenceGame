#ifndef WOLF_MOVEMENT_STRATEGY_H
#define WOLF_MOVEMENT_STRATEGY_H

#include "MovementStrategy.h"

class WolfMovementStrategy : public MovementStrategy {
public:
    std::vector<Position> getPossibleMoves(
        const Animal& animal,
        const GameState& gameState
    ) override;
};

#endif