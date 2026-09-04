import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import "./Game.css";

import {
    setGameSession,
    setEntities,
    setSelectedEntity,
    placeEntity,
    setLoading,
    setError
} from "../store/gameSlice";

import {
    fetchGameSession,
    fetchGameEntities,
    saveGameSetup,
    simulateDay
} from "../services/gameApi";

function Game() {

    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        session,
        entities,
        selectedEntity,
        loading,
        initialEntityCounts,
        error
    } = useSelector((state) => state.game);

    useEffect(() => {

        async function loadGame() {

            try {

                dispatch(setLoading(true));
                dispatch(setError(null));

                const gameSession =
                    await fetchGameSession(id);

                const gameEntities =
                    await fetchGameEntities(id);

                dispatch(setGameSession(gameSession));
                dispatch(setEntities(gameEntities));

            } catch (error) {

                console.error(
                    "Failed to load game:",
                    error
                );

                dispatch(
                    setError(error.message)
                );

            } finally {

                dispatch(setLoading(false));
            }
        }

        loadGame();

    }, [id, dispatch]);


    async function handleSaveSetup() {

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            await saveGameSetup(
                id,
                entities
            );

            console.log(
                "Game setup saved successfully"
            );

        } catch (error) {

            console.error(
                "Failed to save game setup:",
                error
            );

            dispatch(
                setError(error.message)
            );

        } finally {

            dispatch(setLoading(false));
        }
    }


    async function handleSimulateDay() {

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            const gameState =
                await simulateDay(id);

            dispatch(
                setGameSession({
                    ...session,
                    currentDay: gameState.currentDay,
                    maxDays: gameState.maxDays,
                    status: gameState.status,
                    boardRows: gameState.boardRows,
                    boardColumns: gameState.boardColumns
                })
            );

            dispatch(
                setEntities(gameState.entities)
            );

        } catch (error) {

            console.error(
                "Failed to simulate day:",
                error
            );

            dispatch(
                setError(error.message)
            );

        } finally {

            dispatch(setLoading(false));
        }
    }


    function handleCellClick(row, column) {

        dispatch(
            placeEntity({
                row,
                column
            })
        );
    }


    if (loading && !session) {
        return <h2>Loading game...</h2>;
    }

    if (!session) {
        return <h2>Game session not found</h2>;
    }

    const rows = session.boardRows;
    const columns = session.boardColumns;
    console.log(session);
    console.log(rows);
    console.log(columns);

    return (
        <div className="game-container">

            <h1>
                Game #{session.id}
            </h1>

            <p>
                Day {session.currentDay} / {session.maxDays}
            </p>

            <p>
                Status: {session.status}
            </p>

            {error && (
                <p className="game-error">
                    {error}
                </p>
            )}

            <div className="entity-picker">

                <button
                    onClick={() =>
                        dispatch(
                            setSelectedEntity("grass")
                        )
                    }
                >
                🌱 Grass{" "}
                {initialEntityCounts.grass}
                /
                {session.maxInitialGrass}
                </button>

                <button
                    onClick={() =>
                        dispatch(
                            setSelectedEntity("sheep")
                        )
                    }
                >
                    🐑 Sheep{" "}
                    {initialEntityCounts.sheep}
                    /
                    {session.maxInitialSheep}
                </button>

                <button
                    onClick={() =>
                        dispatch(
                            setSelectedEntity("wolf")
                        )
                    }
                >
                    🐺 Wolf{" "}
                    {initialEntityCounts.wolf}
                    /
                    {session.maxInitialWolves}
                </button>

            </div>

            <p>
                Selected:{" "}
                {selectedEntity || "None"}
            </p>

            <div
                className="game-board"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 70px)`,
                    gridTemplateRows: `repeat(${rows}, 70px)`
                }}
            >

                {Array.from(
                    { length: rows },
                    (_, row) =>
                        Array.from(
                            { length: columns },
                            (_, column) => {

                                const cellEntities =
                                    entities.filter(
                                        (entity) =>
                                            entity.row === row &&
                                            entity.column === column
                                    );

                                return (
                                    <div
                                        className="game-cell"
                                        key={`${row}-${column}`}
                                        onClick={() =>
                                            handleCellClick(
                                                row,
                                                column
                                            )
                                        }
                                    >

                                        {cellEntities.map(
                                            (entity) => (
                                                <span
                                                    key={entity.id}
                                                >
                                                    {
                                                        entity.type === "grass"
                                                            ? "🌱"
                                                            : entity.type === "sheep"
                                                            ? "🐑"
                                                            : "🐺"
                                                    }
                                                </span>
                                            )
                                        )}

                                    </div>
                                );
                            }
                        )
                )}

            </div>

            <div className="game-actions">

                <button
                    onClick={handleSaveSetup}
                    disabled={loading}
                >
                    Save Setup
                </button>

                <button
                    onClick={handleSimulateDay}
                    disabled={loading}
                >
                    Simulate Day
                </button>

            </div>

        </div>
    );
}

export default Game;