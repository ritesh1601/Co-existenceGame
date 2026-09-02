#include "GameState.h"

GameState::GameState(int rows, int columns)
    : board(rows, columns),
      currentDay(0),
      nextSheepId(1),
      maxDays(0),
      status(GameStatus::RUNNING) {
}

Board& GameState::getBoard() {
    return board;
}
const Board& GameState::getBoard() const {
    return board;
}

std::vector<Grass*>& GameState::getGrass() {
    return grass;
}
const std::vector<Grass*>& GameState::getGrass() const {
    return grass;
}

std::vector<Sheep*>& GameState::getSheep() {
    return sheep;
}
const std::vector<Sheep*>& GameState::getSheep() const {
    return sheep;
}

std::vector<Wolf*>& GameState::getWolves() {
    return wolves;
}
const std::vector<Wolf*>& GameState::getWolves() const {
    return wolves;
}

int GameState::getCurrentDay() const {
    return currentDay;
}

void GameState::nextDay() {
    currentDay++;
}

void GameState::addGrass(Grass* newGrass) {

    if (newGrass == nullptr)
        return;

    Position position = newGrass->getPosition();

    if (!board.isValidPosition(position.row, position.col))
        return;

    Cell& cell = board.getCell(position.row, position.col);

    if (cell.hasGrass())
        return;

    grass.push_back(newGrass);
    cell.setGrass(newGrass);
}

void GameState::addSheep(Sheep* newSheep) {

    if (newSheep == nullptr)
        return;

    Position position = newSheep->getPosition();

    if (!board.isValidPosition(position.row, position.col))
        return;

    Cell& cell = board.getCell(position.row, position.col);

    if (cell.hasSheep())
        return;

    sheep.push_back(newSheep);
    cell.setSheep(newSheep);
}

void GameState::addWolf(Wolf* newWolf) {

    if (newWolf == nullptr)
        return;

    Position position = newWolf->getPosition();

    if (!board.isValidPosition(position.row, position.col))
        return;

    Cell& cell = board.getCell(position.row, position.col);

    if (cell.hasWolf())
        return;

    wolves.push_back(newWolf);
    cell.setWolf(newWolf);
}


int GameState::getMaxDays() const {
    return maxDays;
}

void GameState::setMaxDays(int maxDays) {
    this->maxDays = maxDays;
}

GameStatus GameState::getStatus() const {
    return status;
}
int GameState::getNextSheepId() {
    return nextSheepId++;
}

void GameState::setStatus(GameStatus status) {
    this->status = status;
}