const gameSessionService = require("../services/gameSessionService");

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

async function createGameSession(req, res) {

    try {

        const {
            boardRows = 5,
            boardColumns = 5,
            maxDays = 10,
            maxInitialSheep = 10,
            maxInitialWolves = 5,
            maxInitialGrass = 20
        } = req.body;

        const userId = Number(req.user.id);

        if (!isPositiveInteger(userId)) {

            return res.status(400).json({
                message: "userId must be a positive integer"
            });
        }

        if (
            !isPositiveInteger(boardRows) ||
            !isPositiveInteger(boardColumns) ||
            !isPositiveInteger(maxDays)
        ) {

            return res.status(400).json({
                message:
                    "boardRows, boardColumns, and maxDays must be positive integers"
            });
        }

        if (
            !Number.isInteger(maxInitialSheep) ||
            maxInitialSheep < 0
        ) {

            return res.status(400).json({
                message:
                    "maxInitialSheep must be a non-negative integer"
            });
        }

        if (
            !Number.isInteger(maxInitialWolves) ||
            maxInitialWolves < 0
        ) {

            return res.status(400).json({
                message:
                    "maxInitialWolves must be a non-negative integer"
            });
        }

        if (
            !Number.isInteger(maxInitialGrass) ||
            maxInitialGrass < 0
        ) {

            return res.status(400).json({
                message:
                    "maxInitialGrass must be a non-negative integer"
            });
        }

        const gameSession =
            await gameSessionService.createGameSession({

                userId,

                boardRows,
                boardColumns,
                maxDays,

                maxInitialSheep,
                maxInitialWolves,
                maxInitialGrass
            });

        return res.status(201).json({

            message: "Game session created",

            gameSession
        });

    } catch (error) {

        console.error(
            "Game session creation error:",
            error
        );

        if (error.code === "23503") {

            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(500).json({
            message: "Could not create game session"
        });
    }
}

async function getGameSessionById(req, res) {
    try {
        const id = Number(req.params.id);
        const userId=Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
            message: "Invalid authenticated user"
            });
        }

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const gameSession =
            await gameSessionService.getGameSessionById(id,userId);

        if (!gameSession) {
            return res.status(404).json({
                message: "Game session not found"
            });
        }

        return res.status(200).json({
            gameSession
        });

    } catch (error) {
        console.error("Get game session error:", error);

        return res.status(500).json({
            message: "Could not get game session"
        });
    }
}

async function getGameSessionsByUserId(req, res) {
    try {
        const userId = Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "userId must be a positive integer"
            });
        }

        const gameSessions =
            await gameSessionService.getGameSessionsByUserId(userId);

        return res.status(200).json({
            gameSessions
        });

    } catch (error) {
        console.error("Get game sessions error:", error);

        return res.status(500).json({
            message: "Could not get game sessions"
        });
    }
}

async function updateGameSession(req, res) {
    try {
        const id = Number(req.params.id);
        const userId=Number(req.user.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const {
            currentDay,
            status,
            completedAt = null
        } = req.body;

        if (!Number.isInteger(currentDay) || currentDay < 0) {
            return res.status(400).json({
                message: "currentDay must be a non-negative integer"
            });
        }

        const allowedStatuses = [
            "in_progress",
            "won",
            "lost",
            "abandoned"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const gameSession =
            await gameSessionService.updateGameSession(id,userId, {
                currentDay,
                status,
                completedAt
            });

        if (!gameSession) {
            return res.status(404).json({
                message: "Game session not found"
            });
        }

        return res.status(200).json({
            message: "Game session updated",
            gameSession
        });

        } catch (error) {
            console.error("Update game session error:", error);

            if (error.code === "23514") {
                return res.status(400).json({
                    message: "currentDay cannot be greater than maxDays"
                });
            }

            return res.status(500).json({
                message: "Could not update game session"
            });
        }
}

async function startGameSession(req, res) {
    try {
        const id = Number(req.params.id);
        const userId=Number(req.user.id);

        if(!Number.isInteger(userId) || userId<=0){
            return res.status(400).json({
                message:"Invalid user id"
            })
        }

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const gameSession =
            await gameSessionService.startGameSession(id,userId);

        if (!gameSession) {
            return res.status(404).json({
                message: "Game session not found"
            });
        }

        return res.status(200).json({
            message: "Game session started",
            gameSession
        });

    } catch (error) {
        console.error("Start game session error:", error);

        return res.status(500).json({
            message: "Could not start game session"
        });
    }
}

async function saveGameSetup(req, res) {
    try {
        const gameSessionId = Number(req.params.id);
        const userId = Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                message: "Invalid authenticated user"
            });
        }

        if (!Number.isInteger(gameSessionId) || gameSessionId <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const { entities } = req.body;

        if (!Array.isArray(entities)) {
            return res.status(400).json({
                message: "entities must be an array"
            });
        }

        const result = await gameSessionService.saveGameSetup(
            gameSessionId,
            userId,
            entities
        );

        if (result?.error === "GAME_SESSION_NOT_FOUND") {
            return res.status(404).json({
                message: "Game session not found"
            });
        }

        if (result?.error === "INVALID_ENTITY") {
            return res.status(400).json({
                message: "Invalid entity data"
            });
        }

        if (result?.error === "POSITION_OUT_OF_BOUNDS") {
            return res.status(400).json({
                message: "Entity position is outside the game board"
            });
        }

        if (result?.error === "POSITION_OCCUPIED") {
            return res.status(400).json({
                message: "Multiple entities cannot occupy the same position"
            });
        }

        return res.status(200).json({
            message: "Game setup saved successfully",
            entities: result.entities
        });

    } catch (error) {
        console.error("Save game setup error:", error);

        return res.status(500).json({
            message: "Could not save game setup"
        });
    }
}

module.exports = {
    createGameSession,
    getGameSessionById,
    getGameSessionsByUserId,
    updateGameSession,
    startGameSession,
    saveGameSetup
};
