const gameEntityService = require("../services/gameEntityService");

async function createGameEntity(req, res) {
    try {
        const gameSessionId = Number(req.params.id);

        const {
            entityType,
            row,
            column
        } = req.body;

        if (!Number.isInteger(gameSessionId) || gameSessionId <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const allowedTypes = [
            "grass",
            "sheep",
            "wolf"
        ];

        if (!allowedTypes.includes(entityType)) {
            return res.status(400).json({
                message: "Invalid entity type"
            });
        }

        if (!Number.isInteger(row) || row < 0 ||
            !Number.isInteger(column) || column < 0) {
            return res.status(400).json({
                message: "row and column must be non-negative integers"
            });
        }

        const entity = await gameEntityService.createGameEntity({
            gameSessionId,
            entityType,
            row,
            column
        });

        if (entity?.error === "GAME_SESSION_NOT_FOUND") {
            return res.status(404).json({
                message: "Game session not found"
            });
        }

        if (entity?.error === "POSITION_OUT_OF_BOUNDS") {
            return res.status(400).json({
                message: "Entity position is outside the game board"
            });
        }

        return res.status(201).json({
            message: "Game entity created",
            entity
        });

    } catch (error) {
        console.error("Create game entity error:", error);

        if (error.code === "23503") {
            return res.status(404).json({
                message: "Game session not found"
            });
        }

        return res.status(500).json({
            message: "Could not create game entity"
        });
    }
}

async function getGameEntities(req, res) {
    try {
        const gameSessionId = Number(req.params.id);

        if (!Number.isInteger(gameSessionId) || gameSessionId <= 0) {
            return res.status(400).json({
                message: "Invalid game session id"
            });
        }

        const entities =
            await gameEntityService.getGameEntities(gameSessionId);

        return res.status(200).json({
            entities
        });

    } catch (error) {
        console.error("Get game entities error:", error);

        return res.status(500).json({
            message: "Could not get game entities"
        });
    }
}

module.exports = {
    createGameEntity,
    getGameEntities
};