#ifndef SIMULATION_ENGINE_H
#define SIMULATION_ENGINE_H

#include "GameState.h"
#include "SheepMovementStrategy.h"
#include "WolfMovementStrategy.h"

#include <vector>
#include <random>
#include <unordered_set>



class SimulationEngine {
public:
    SimulationEngine();

    void tick(GameState& gameState);

private:
    void moveAnimals(GameState& gameState);
    
    void moveSheep(GameState& gameState);
    void moveWolves(GameState& gameState);

    void resolveInteractions(GameState& gameState);

    void reproduceSheep(GameState& gameState);

    void updateSurvival(GameState& gameState);

    void removeDeadAnimals(GameState& gameState);

    void checkGameStatus(GameState& gameState);

    Position chooseRandomMove(
        const std::vector<Position>& possibleMoves
    );
};

#endif