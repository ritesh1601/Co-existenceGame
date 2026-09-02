#include <iostream>

#include "GameState.h"
#include "SimulationEngine.h"

namespace {

int failures = 0;

void expect(bool condition, const char* name) {
    if (condition) {
        std::cout << "PASS: " << name << '\n';
    } else {
        std::cout << "FAIL: " << name << '\n';
        ++failures;
    }
}

bool animalsAreOnBoard(const GameState& state) {
    const Board& board = state.getBoard();

    for (const Sheep* sheep : state.getSheep()) {
        Position position = sheep->getPosition();
        if (!board.isValidPosition(position.row, position.col)) {
            return false;
        }
    }

    for (const Wolf* wolf : state.getWolves()) {
        Position position = wolf->getPosition();
        if (!board.isValidPosition(position.row, position.col)) {
            return false;
        }
    }

    return true;
}

void addGrassBlock(GameState& state, int centerRow, int centerCol) {
    int id = static_cast<int>(state.getGrass().size()) + 1;
    for (int row = centerRow - 1; row <= centerRow + 1; ++row) {
        for (int col = centerCol - 1; col <= centerCol + 1; ++col) {
            state.addGrass(new Grass(id++, Position(row, col)));
        }
    }
}

void testNormalSimulation() {
    GameState state(7, 7);
    state.setMaxDays(20);
    state.addGrass(new Grass(1, Position(1, 1)));
    state.addGrass(new Grass(2, Position(3, 3)));
    state.addGrass(new Grass(3, Position(5, 5)));
    state.addSheep(new Sheep(1, Position(0, 0)));
    state.addSheep(new Sheep(2, Position(4, 4)));
    state.addWolf(new Wolf(1, Position(0, 6)));
    state.addWolf(new Wolf(2, Position(6, 0)));

    SimulationEngine engine;
    for (int day = 0; day < 5; ++day) {
        engine.tick(state);
    }

    expect(state.getCurrentDay() == 5 && animalsAreOnBoard(state),
           "normal simulation advances five days with valid positions");
}

void testSheepAlreadyOnGrass() {
    GameState state(7, 7);
    state.setMaxDays(20);
    state.addGrass(new Grass(1, Position(3, 3)));
    state.addSheep(new Sheep(1, Position(3, 3)));
    state.addWolf(new Wolf(1, Position(0, 0)));

    SimulationEngine engine;
    engine.tick(state);

    const Sheep* sheep = state.getSheep().front();
    Position position = sheep->getPosition();
    bool stayedOnGrass = position.row == 3 && position.col == 3;

    expect(stayedOnGrass && state.getSheep().size() == 2,
           "sheep on grass stays, eats, and creates one newborn");
}

void testWolfCatchesSheep() {
    GameState state(3, 3);
    state.setMaxDays(20);
    state.addSheep(new Sheep(1, Position(1, 1)));
    state.addWolf(new Wolf(1, Position(1, 0)));

    SimulationEngine engine;
    engine.tick(state);

    expect(state.getSheep().empty(),
           "an adjacent wolf catches and eats an unmoving sheep");
}

void testWolfMissesFood() {
    GameState state(10, 10);
    state.setMaxDays(20);
    state.addSheep(new Sheep(1, Position(0, 0)));
    state.addWolf(new Wolf(1, Position(9, 9)));

    SimulationEngine engine;
    for (int day = 0; day < 4; ++day) {
        engine.tick(state);
    }

    expect(state.getWolves().empty(),
           "a distant wolf without food dies on the fourth day");
}

void testSheepMissesGrass() {
    GameState state(15, 15);
    state.setMaxDays(20);
    state.addGrass(new Grass(1, Position(14, 0)));
    state.addSheep(new Sheep(1, Position(0, 0)));
    state.addWolf(new Wolf(1, Position(14, 14)));

    SimulationEngine engine;
    for (int day = 0; day < 4; ++day) {
        engine.tick(state);
    }

    expect(state.getSheep().empty(),
           "a sheep too far from grass dies on the fourth day");
}

void testReproduction() {
    GameState state(10, 10);
    state.setMaxDays(20);
    addGrassBlock(state, 2, 2);
    addGrassBlock(state, 7, 7);
    state.addSheep(new Sheep(1, Position(2, 2)));
    state.addSheep(new Sheep(2, Position(7, 7)));
    state.addWolf(new Wolf(1, Position(0, 9)));

    SimulationEngine engine;
    engine.tick(state);

    expect(state.getSheep().size() == 4,
           "each of two grass-fed sheep creates one newborn");
}

void testCrowdedBoard() {
    GameState state(3, 3);
    state.setMaxDays(20);

    int id = 1;
    for (int row = 0; row < 3; ++row) {
        for (int col = 0; col < 3; ++col) {
            state.addGrass(new Grass(id, Position(row, col)));
            state.addSheep(new Sheep(id++, Position(row, col)));
        }
    }

    SimulationEngine engine;
    engine.tick(state);

    expect(state.getSheep().size() == 9 && animalsAreOnBoard(state),
           "a full board does not move or create sheep when no cell is free");
}

void testLongSurvival() {
    GameState state(15, 15);
    state.setMaxDays(100);

    int grassId = 1;
    for (int row = 0; row < 15; ++row) {
        for (int col = 0; col < 15; ++col) {
            state.addGrass(new Grass(grassId++, Position(row, col)));
        }
    }

    state.addSheep(new Sheep(1, Position(2, 2)));
    state.addSheep(new Sheep(2, Position(2, 12)));
    state.addSheep(new Sheep(3, Position(12, 2)));
    state.addSheep(new Sheep(4, Position(12, 12)));
    state.addWolf(new Wolf(1, Position(2, 3)));
    state.addWolf(new Wolf(2, Position(12, 11)));

    SimulationEngine engine;
    while (state.getStatus() == GameStatus::RUNNING &&
           state.getCurrentDay() < 50) {
        engine.tick(state);
        std::cout << "  day " << state.getCurrentDay()
                  << ": sheep " << state.getSheep().size()
                  << ", wolves " << state.getWolves().size() << '\n';
    }

    std::cout << "Long-survival result: day " << state.getCurrentDay()
              << ", sheep " << state.getSheep().size()
              << ", wolves " << state.getWolves().size() << '\n';

    expect(state.getCurrentDay() == 50 && animalsAreOnBoard(state),
           "large-day simulation remains stable for fifty days");
}

}  // namespace

int main() {
    testNormalSimulation();
    testSheepAlreadyOnGrass();
    testWolfCatchesSheep();
    testWolfMissesFood();
    testSheepMissesGrass();
    testReproduction();
    testCrowdedBoard();
    testLongSurvival();

    std::cout << (failures == 0 ? "All scenario tests passed.\n"
                                : "Scenario tests failed.\n");
    return failures == 0 ? 0 : 1;
}
