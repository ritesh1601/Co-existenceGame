#ifndef GAME_STATE_H
#define GAME_STATE_H

#include "GameStatus.h"
#include "Board.h"
#include "Grass.h"
#include "Sheep.h"
#include "Wolf.h"

#include <vector>

class GameState {
private:
    Board board;

    std::vector<Grass*> grass;
    std::vector<Sheep*> sheep;
    std::vector<Wolf*> wolves;
    
    
    int currentDay;
    int nextSheepId;
    int maxDays;
    GameStatus status;



public:
    GameState(int rows, int columns);

    Board& getBoard();
    const Board& getBoard() const;

    std::vector<Grass*>& getGrass();
    const std::vector<Grass*>& getGrass() const;

    std::vector<Sheep*>& getSheep();
    const std::vector<Sheep*>& getSheep() const;

    std::vector<Wolf*>& getWolves();
    const std::vector<Wolf*>& getWolves() const;

    int getCurrentDay() const;

    void nextDay();
    int getNextSheepId();
    void addGrass(Grass* grass);
    void addSheep(Sheep* sheep);
    void addWolf(Wolf* wolf);

    int getMaxDays() const; 
    void setMaxDays(int maxDays);

    GameStatus getStatus() const;
    void setStatus(GameStatus status);

};

#endif