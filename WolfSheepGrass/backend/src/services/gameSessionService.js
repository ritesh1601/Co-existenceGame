const pool = require("../db/database");

async function createGameSession({
    userId,
    boardRows,
    boardColumns,
    maxDays,
    maxInitialSheep,
    maxInitialWolves,
    maxInitialGrass
}) {

    const result = await pool.query(
        `
        INSERT INTO game_sessions (
            user_id,
            board_rows,
            board_columns,
            max_days,
            max_initial_sheep,
            max_initial_wolves,
            max_initial_grass
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)

        RETURNING
            id,
            user_id,
            status,
            board_rows,
            board_columns,
            current_day,
            max_days,

            max_initial_sheep,
            max_initial_wolves,
            max_initial_grass,

            started_at,
            completed_at,
            created_at,
            updated_at
        `,
        [
            userId,
            boardRows,
            boardColumns,
            maxDays,
            maxInitialSheep,
            maxInitialWolves,
            maxInitialGrass
        ]
    );

    return result.rows[0];
}

async function getGameSessionById(id,userId) {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            status,
            board_rows,
            board_columns,
            current_day,
            max_days,
            started_at,
            completed_at,
            created_at,
            updated_at,
            max_initial_sheep,
            max_initial_wolves,
            max_initial_grass
        FROM game_sessions
        WHERE id = $1 AND user_id = $2
        `,
        [id,userId]
    );

    return result.rows[0] || null;
}

async function getGameSessionsByUserId(userId) {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            status,
            board_rows,
            board_columns,
            current_day,
            max_days,
            started_at,
            completed_at,
            created_at,
            updated_at
        FROM game_sessions
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return result.rows;
}

async function updateGameSession(id, userId,{
    currentDay,
    status,
    completedAt
}) {
    const result = await pool.query(
        `
        UPDATE game_sessions
        SET
            current_day = $1,
            status = $2,
            completed_at = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4 AND user_id = $5
        RETURNING
            id,
            user_id,
            status,
            board_rows,
            board_columns,
            current_day,
            max_days,
            started_at,
            completed_at,
            created_at,
            updated_at
        `,
        [currentDay, status, completedAt, id, userId]
    );

    return result.rows[0];
}

async function startGameSession(id,userId) {
    const result = await pool.query(
        `
        UPDATE game_sessions
        SET
            status = 'in_progress',
            current_day = 0,
            started_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2
        RETURNING
            id,
            user_id,
            status,
            board_rows,
            board_columns,
            current_day,
            max_days,
            started_at,
            completed_at,
            created_at,
            updated_at
        `,
        [id,userId]
    );

    return result.rows[0] || null;
}

async function saveGameSetup(gameSessionId, userId, entities) {

    const gameResult = await pool.query(
        `
        SELECT board_rows, board_columns, status
        FROM game_sessions
        WHERE id = $1 AND user_id = $2
        `,
        [gameSessionId, userId]
    );

    if (gameResult.rows.length === 0) {
        return {
            error: "GAME_SESSION_NOT_FOUND"
        };
    }

    const {
        board_rows,
        board_columns,
        status
    } = gameResult.rows[0];

    if (status !== "in_progress") {
        return {
            error: "GAME_NOT_IN_PROGRESS"
        };
    }

    const allowedTypes = [
        "grass",
        "sheep",
        "wolf"
    ];

    const positions = new Map();

    for (const entity of entities) {

        if (
            !allowedTypes.includes(entity.entityType) ||
            !Number.isInteger(entity.row) ||
            !Number.isInteger(entity.column)
        ) {
            return {
                error: "INVALID_ENTITY"
            };
        }

        if (
            entity.row < 0 ||
            entity.row >= Number(board_rows) ||
            entity.column < 0 ||
            entity.column >= Number(board_columns)
        ) {
            return {
                error: "POSITION_OUT_OF_BOUNDS"
            };
        }

        const position =
            `${entity.row}-${entity.column}`;

        if (!positions.has(position)) {
            positions.set(position, []);
        }

        positions.get(position).push(entity.entityType);
    }

    // Validate entities sharing the same position
    for (const entityTypes of positions.values()) {

        // Maximum two entities on one cell
        if (entityTypes.length > 2) {
            return {
                error: "POSITION_OCCUPIED"
            };
        }

        if (entityTypes.length === 2) {

            const [first, second] = entityTypes;

            // Same entity cannot occupy the same cell twice
            if (first === second) {
                return {
                    error: "POSITION_OCCUPIED"
                };
            }

            // Sheep + Wolf is not allowed during placement
            if (
                (first === "sheep" && second === "wolf") ||
                (first === "wolf" && second === "sheep")
            ) {
                return {
                    error: "POSITION_OCCUPIED"
                };
            }

            // Grass + Sheep -> allowed
            // Grass + Wolf  -> allowed
        }
    }

    return await pool.withTransaction(async (client) => {

        await client.query(
            `
            DELETE FROM game_entities
            WHERE game_session_id = $1
            `,
            [gameSessionId]
        );

        const savedEntities = [];

        for (const entity of entities) {

            const result = await client.query(
                `
                INSERT INTO game_entities (
                    game_session_id,
                    entity_type,
                    row_position,
                    column_position
                )
                VALUES ($1, $2, $3, $4)
                RETURNING
                    id,
                    game_session_id,
                    entity_type,
                    row_position,
                    column_position,
                    days_without_food,
                    created_at,
                    updated_at
                `,
                [
                    gameSessionId,
                    entity.entityType,
                    entity.row,
                    entity.column
                ]
            );

            savedEntities.push(result.rows[0]);
        }

        return {
            entities: savedEntities
        };
    });
}

module.exports = {
    createGameSession,
    getGameSessionById,
    getGameSessionsByUserId,
    updateGameSession,
    startGameSession,
    saveGameSetup
};
