const simulationService = require("../services/simulationService");

async function simulateDay(req, res) {

    try {
        const gameSessionId = Number(req.params.id);
        const userId=Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        if (!Number.isInteger(gameSessionId) || gameSessionId <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const result =
            await simulationService.simulateDay(gameSessionId,userId);

        return res.status(200).json({
            message: "Day simulated successfully",
            gameState: result
        });

    }catch (error) {

    if (error.message === "GAME_SESSION_NOT_FOUND") {
        console.error("Game session not found:", error);

        return res.status(404).json({
            message: "Game session not found"
        });
    }

    if (error.message === "GAME_NOT_IN_PROGRESS") {
        return res.status(400).json({
            message: "Game is not in progress"
        });
    }

    console.error("Unexpected simulation error:", error);

    return res.status(500).json({
        message: "Could not simulate day"
    });
}
}

module.exports = {
    simulateDay
};