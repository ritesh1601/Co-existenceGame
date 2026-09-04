const API_URL = "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("token");
}

function convertDatabaseEntity(entity) {
    return {
        id: Number(entity.id),
        type: entity.entity_type,
        row: Number(entity.row_position),
        column: Number(entity.column_position),
        daysWithoutFood: Number(entity.days_without_food || 0)
    };
}

export async function fetchGameSession(id) {

    const token = getToken();

    const result = await fetch(
        `${API_URL}/game-sessions/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.message);
    }

    return {
        id: Number(data.gameSession.id),

        userId:
            Number(data.gameSession.user_id),

        status:
            data.gameSession.status,

        boardRows:
            Number(data.gameSession.board_rows),

        boardColumns:
            Number(data.gameSession.board_columns),

        currentDay:
            Number(data.gameSession.current_day),

        maxDays:
            Number(data.gameSession.max_days),

        maxInitialSheep:
            Number(data.gameSession.max_initial_sheep),

        maxInitialWolves:
            Number(data.gameSession.max_initial_wolves),

        maxInitialGrass:
            Number(data.gameSession.max_initial_grass),

        startedAt:
            data.gameSession.started_at,

        completedAt:
            data.gameSession.completed_at,

        createdAt:
            data.gameSession.created_at,

        updatedAt:
            data.gameSession.updated_at
    };
}

export async function fetchGameEntities(id) {

    const token = getToken();

    const result = await fetch(
        `${API_URL}/game-sessions/${id}/entities`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.message);
    }

    return data.entities.map(convertDatabaseEntity);
}

export async function saveGameSetup(id, entities) {

    const token = getToken();

    const result = await fetch(
        `${API_URL}/game-sessions/${id}/setup`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                entities: entities.map((entity) => ({
                    entityType: entity.type,
                    row: entity.row,
                    column: entity.column
                }))
            })
        }
    );

    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function simulateDay(id) {

    const token = getToken();

    const result = await fetch(
        `${API_URL}/game-sessions/${id}/tick`,
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.message);
    }

    const gameState = data.gameState;

    return {
        boardRows: Number(gameState.boardRows),
        boardColumns: Number(gameState.boardColumns),

        currentDay: Number(gameState.currentDay),
        maxDays: Number(gameState.maxDays),

        status: gameState.status,

        entities: gameState.entities.map((entity) => ({
            id: Number(entity.id),
            type: entity.type,
            row: Number(entity.row),
            column: Number(entity.column),
            daysWithoutFood: Number(
                entity.daysWithoutFood || 0
            )
        }))
    };
}