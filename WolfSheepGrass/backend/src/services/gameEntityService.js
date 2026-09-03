const pool = require("../db/database");

async function createGameEntity({
    gameSessionId,
    entityType,
    row,
    column
}) {
    const gameResult = await pool.query(
        `
        SELECT board_rows, board_columns
        FROM game_sessions
        WHERE id = $1
        `,
        [gameSessionId]
    );

    if (gameResult.rows.length === 0) {
        return {
            error: "GAME_SESSION_NOT_FOUND"
        };
    }

    const {
        board_rows,
        board_columns
    } = gameResult.rows[0];

    if (
        row < 0 ||
        row >= board_rows ||
        column < 0 ||
        column >= board_columns
    ) {
        return {
            error: "POSITION_OUT_OF_BOUNDS"
        };
    }

    const result = await pool.query(
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
        [gameSessionId, entityType, row, column]
    );

    return result.rows[0];
}

async function getGameEntities(gameSessionId) {
    const result = await pool.query(
        `
        SELECT
            id,
            game_session_id,
            entity_type,
            row_position,
            column_position,
            days_without_food,
            created_at,
            updated_at
        FROM game_entities
        WHERE game_session_id = $1
        ORDER BY id
        `,
        [gameSessionId]
    );

    return result.rows;
}

async function saveSimulationResult(client, gameSessionId, entities) {

    await client.query(
        `
        DELETE FROM game_entities
        WHERE game_session_id = $1
        `,
        [gameSessionId]
    );

    for (const entity of entities) {

        await client.query(
            `
            INSERT INTO game_entities (
                game_session_id,
                entity_type,
                row_position,
                column_position,
                days_without_food
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                gameSessionId,
                entity.type,
                entity.row,
                entity.column,
                entity.daysWithoutFood || 0
            ]
        );
    }
}

module.exports = {
    createGameEntity,
    getGameEntities,
    saveSimulationResult
};