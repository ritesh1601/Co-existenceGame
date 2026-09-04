import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Game.css";

function Game() {
    const { id } = useParams();

    const [gameSession, setGameSession] = useState(null);
    const [entities, setEntities] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);

    useEffect(() => {
        async function fetchGameSession() {
            try {
                const token = localStorage.getItem("token");

                const result = await fetch(
                    `http://localhost:5000/api/game-sessions/${id}`,
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

                setGameSession(data.gameSession);

            } catch (error) {
                console.error("Failed to fetch game session:", error);
            }
        }

        fetchGameSession();
    }, [id]);

    useEffect(() => {
        async function fetchEntities() {
            try {
                const token = localStorage.getItem("token");

                const result = await fetch(
                    `http://localhost:5000/api/game-sessions/${id}/entities`,
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

                setEntities(data.entities);

            } catch (error) {
                console.error("Failed to fetch entities:", error);
            }
        }

        fetchEntities();
    }, [id]);

    function canPlaceEntity(row, column, entityType) {
        const entitiesAtPosition = entities.filter(
            (entity) =>
                Number(entity.row_position) === row &&
                Number(entity.column_position) === column
        );

        // Empty cell
        if (entitiesAtPosition.length === 0) {
            return true;
        }

        // A cell can contain at most 2 entities
        if (entitiesAtPosition.length >= 2) {
            return false;
        }

        const existingType = entitiesAtPosition[0].entity_type;

        // Same entity cannot be placed twice
        if (existingType === entityType) {
            return false;
        }

        // Grass + Sheep is allowed
        if (
            (existingType === "grass" && entityType === "sheep") ||
            (existingType === "sheep" && entityType === "grass")
        ) {
            return true;
        }

        // Grass + Wolf is allowed
        if (
            (existingType === "grass" && entityType === "wolf") ||
            (existingType === "wolf" && entityType === "grass")
        ) {
            return true;
        }

        // Sheep + Wolf is NOT allowed during placement
        if (
            (existingType === "sheep" && entityType === "wolf") ||
            (existingType === "wolf" && entityType === "sheep")
        ) {
            return false;
        }

        return false;
    }

    function placeEntity(row, column) {
        if (!selectedEntity) {
            return;
        }

        if (!canPlaceEntity(row, column, selectedEntity)) {
            console.log("Entity placement not allowed");
            return;
        }

        setEntities((previousEntities) => [
            ...previousEntities,
            {
                entity_type: selectedEntity,
                row_position: row,
                column_position: column,
                days_without_food: 0
            }
        ]);
    }

    async function saveGameSetup() {
        try {
            const token = localStorage.getItem("token");

            const result = await fetch(
                `http://localhost:5000/api/game-sessions/${id}/setup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        entities: entities.map((entity) => ({
                            entityType: entity.entity_type,
                            row: Number(entity.row_position),
                            column: Number(entity.column_position)
                        }))
                    })
                }
            );

            const data = await result.json();

            if (!result.ok) {
                throw new Error(data.message);
            }

            console.log("Game setup saved:", data);

            // Replace temporary frontend entities
            // with entities returned by the backend.
            setEntities(data.entities);

        } catch (error) {
            console.error("Failed to save game setup:", error);
        }
    }

    if (!gameSession) {
        return <h2>Loading game...</h2>;
    }

    const rows = Number(gameSession.board_rows);
    const columns = Number(gameSession.board_columns);

    return (
        <div>
            <h1>Game #{gameSession.id}</h1>

            <p>
                Day {gameSession.current_day} / {gameSession.max_days}
            </p>

            <p>
                Status: {gameSession.status}
            </p>

            <div>
                <button
                    onClick={() => setSelectedEntity("grass")}
                >
                    🌱 Grass
                </button>

                <button
                    onClick={() => setSelectedEntity("sheep")}
                >
                    🐑 Sheep
                </button>

                <button
                    onClick={() => setSelectedEntity("wolf")}
                >
                    🐺 Wolf
                </button>
            </div>

            <p>
                Selected: {selectedEntity || "None"}
            </p>

            <div className="game-board">
                {Array.from({ length: rows }, (_, row) =>
                    Array.from({ length: columns }, (_, column) => {

                        const entitiesAtPosition = entities.filter(
                            (entity) =>
                                Number(entity.row_position) === row &&
                                Number(entity.column_position) === column
                        );

                        return (
                            <div
                                className="game-cell"
                                key={`${row}-${column}`}
                                onClick={() => placeEntity(row, column)}
                            >
                                {entitiesAtPosition.map((entity, index) => (
                                    <span key={index}>
                                        {entity.entity_type === "grass"
                                            ? "🌱"
                                            : entity.entity_type === "sheep"
                                            ? "🐑"
                                            : "🐺"}
                                    </span>
                                ))}
                            </div>
                        );
                    })
                )}
            </div>

            <button onClick={saveGameSetup}>
                Save Setup
            </button>
        </div>
    );
}

export default Game;