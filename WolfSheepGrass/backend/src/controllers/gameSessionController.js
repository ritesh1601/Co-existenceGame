const gameSessionService = require("../services/gameSessionService");

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

async function createGameSession(req, res) {
    try {
        const {
            userId,
            boardRows = 5,
            boardColumns = 5,
            maxDays = 10
        } = req.body;

        if (!isPositiveInteger(userId)) {
            return res.status(400).json({
                message: "userId must be a positive integer"
            });
        }

        if (!isPositiveInteger(boardRows) ||
            !isPositiveInteger(boardColumns) ||
            !isPositiveInteger(maxDays)) {
            return res.status(400).json({
                message: "boardRows, boardColumns, and maxDays must be positive integers"
            });
        }

        const gameSession = await gameSessionService.createGameSession({
            userId,
            boardRows,
            boardColumns,
            maxDays
        });

        return res.status(201).json({
            message: "Game session created",
            gameSession
        });
    } catch (error) {
        console.error("Game session creation error:", error);

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


// async function getGameSessionById(req, res) {
//     try {
//         const id = Number(req.params.id);

//         if (!Number.isInteger(id) || id <= 0) {
//             return res.status(400).json({
//                 message: "Invalid game session id"
//             });
//         }

//         const gameSession =
//             await gameSessionService.getGameSessionById(id);

//         if (!gameSession) {
//             return res.status(404).json({
//                 message: "Game session not found"
//             });
//         }

//         return res.status(200).json({
//             gameSession
//         });

//     } catch (error) {
//         console.error("Get game session error:", error);

//         return res.status(500).json({
//             message: "Could not get game session"
//         });
//     }
// }

async function getGameSessionById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const gameSession =
            await gameSessionService.getGameSessionById(id);

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
        const userId = Number(req.query.userId);

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
            await gameSessionService.updateGameSession(id, {
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


module.exports = {
    createGameSession,
    getGameSessionById,
    getGameSessionsByUserId,
    updateGameSession
};
