const pool = require("../db/database");

async function createGameSession({
    userId,
    boardRows = 5,
    boardColumns = 5,
    maxDays = 10
}) {
    const result = await pool.query(
        `
        INSERT INTO game_sessions (
            user_id,
            board_rows,
            board_columns,
            max_days
        )
        VALUES ($1, $2, $3, $4)
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
        [userId, boardRows, boardColumns, maxDays]
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
            updated_at
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

module.exports = {
    createGameSession,
    getGameSessionById,
    getGameSessionsByUserId,
    updateGameSession,
    startGameSession
};
