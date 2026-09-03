#include <iostream>
#include <fstream>

#include "GameState.h"
#include "SimulationEngine.h"
#include "json/json.hpp"

using namespace std;
using json = nlohmann::json;

void printBoard(const GameState& gameState) {

    const Board& board = gameState.getBoard();

    cout << "\nDay " << gameState.getCurrentDay() << "\n\n";

    for (int row = 0; row < board.getRows(); row++) {

        for (int col = 0; col < board.getColumns(); col++) {

            const Cell& cell = board.getCell(row, col);

            if (cell.hasSheep() && cell.hasWolf()) {
                cout << "X ";       // Sheep + Wolf
            }
            else if (cell.hasSheep()) {
                cout << "S ";       // Sheep
            }
            else if (cell.hasWolf()) {
                cout << "W ";       // Wolf
            }
            else if (cell.hasGrass()) {
                cout << "G ";       // Grass
            }
            else {
                cout << ". ";       // Empty
            }
        }

        cout << '\n';
    }

    cout << "\nSheep: " << gameState.getSheep().size();
    cout << "\nWolves: " << gameState.getWolves().size();
    cout << "\n";
}

json gameStateToJson(const GameState& gameState) {

    json data;

    const Board& board = gameState.getBoard();

    data["boardRows"] = board.getRows();
    data["boardColumns"] = board.getColumns();
    data["currentDay"] = gameState.getCurrentDay();
    data["maxDays"] = gameState.getMaxDays();

    data["entities"] = json::array();

    // Grass
    for (const Grass* grass : gameState.getGrass()) {

        json entity;

        entity["id"] = grass->getId();
        entity["type"] = "grass";
        entity["row"] = grass->getPosition().row;
        entity["column"] = grass->getPosition().col;

        data["entities"].push_back(entity);
    }

    // Sheep
    for (const Sheep* sheep : gameState.getSheep()) {

        json entity;

        entity["id"] = sheep->getId();
        entity["type"] = "sheep";
        entity["row"] = sheep->getPosition().row;
        entity["column"] = sheep->getPosition().col;
        entity["daysWithoutFood"] = sheep->getDaysWithoutFood();

        data["entities"].push_back(entity);
    }

    // Wolves
    for (const Wolf* wolf : gameState.getWolves()) {

        json entity;

        entity["id"] = wolf->getId();
        entity["type"] = "wolf";
        entity["row"] = wolf->getPosition().row;
        entity["column"] = wolf->getPosition().col;
        entity["daysWithoutFood"] = wolf->getDaysWithoutFood();

        data["entities"].push_back(entity);
    }

    return data;
}

int main() {

    // Read JSON from stdin
    json data;

    try {
        cin >> data;
    }
    catch (...) {
        cerr << "Invalid JSON input\n";
        return 1;
    }

    // Read game settings
    int rows = data["boardRows"];
    int columns = data["boardColumns"];
    int currentDay = data["currentDay"];
    int maxDays = data["maxDays"];

    // Create game state
    GameState gameState(rows, columns);

    gameState.setCurrentDay(currentDay);
    gameState.setMaxDays(maxDays);

    // Create entities
    for (const auto& entity : data["entities"]) {

        int id = entity["id"];
        string type = entity["type"];

        int row = entity["row"];
        int column = entity["column"];

        Position position(row, column);

        if (type == "grass") {

            Grass* grass = new Grass(id, position);
            gameState.addGrass(grass);

        }
        else if (type == "sheep") {

            Sheep* sheep = new Sheep(id, position);

            int daysWithoutFood = entity["daysWithoutFood"];
            sheep->setDaysWithoutFood(daysWithoutFood);

            gameState.addSheep(sheep);

        }
        else if (type == "wolf") {

            Wolf* wolf = new Wolf(id, position);

            int daysWithoutFood = entity["daysWithoutFood"];
            wolf->setDaysWithoutFood(daysWithoutFood);

            gameState.addWolf(wolf);
        }
    }

    // Run exactly one simulation day
    SimulationEngine engine;
    engine.tick(gameState);

    // Convert updated state to JSON
    json output = gameStateToJson(gameState);

    // Send ONLY JSON to stdout
    cout << output.dump() << endl;

    return 0;
}