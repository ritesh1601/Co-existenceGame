#include <iostream>
#include "GameState.h"
#include "SimulationEngine.h"

using namespace std;

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

int main() {

    // Create 5 x 5 board
    GameState gameState(4, 5);

    // Game should survive for 10 days
    gameState.setMaxDays(10);

    // -------------------------
    // Add Grass
    // -------------------------

    Grass* grass1 = new Grass(
        1,
        Position(0, 0)
    );

    Grass* grass2 = new Grass(
        2,
        Position(2, 2)
    );

    Grass* grass3 = new Grass(
        3,
        Position(4, 4)
    );

    gameState.addGrass(grass1);
    gameState.addGrass(grass2);
    gameState.addGrass(grass3);


    // -------------------------
    // Add Sheep
    // -------------------------

    Sheep* sheep1 = new Sheep(
        gameState.getNextSheepId(),
        Position(1, 1)
    );

    Sheep* sheep2 = new Sheep(
        gameState.getNextSheepId(),
        Position(3, 3)
    );

    gameState.addSheep(sheep1);
    gameState.addSheep(sheep2);


    // -------------------------
    // Add Wolves
    // -------------------------

    Wolf* wolf1 = new Wolf(
        1,
        Position(0, 4)
    );

    Wolf* wolf2 = new Wolf(
        2,
        Position(4, 0)
    );

    gameState.addWolf(wolf1);
    gameState.addWolf(wolf2);


    // -------------------------
    // Simulation
    // -------------------------

    SimulationEngine engine;

    printBoard(gameState);

    while (gameState.getStatus() == GameStatus::RUNNING) {

        engine.tick(gameState);

        printBoard(gameState);

        cout << "Status: ";

        if (gameState.getStatus() == GameStatus::RUNNING)
            cout << "RUNNING";

        else if (gameState.getStatus() == GameStatus::WON)
            cout << "WON";

        else
            cout << "LOST";

        cout << "\n";

        cout << "-------------------------\n";
    }

    cout << "\nGame Finished!\n";

    return 0;
}