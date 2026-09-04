import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import GameCard from "./GameCard";

function Dashboard() {

    const { user } = useAuth();

    const [gameSessions, setGameSessions] = useState([]);

    const [creatingGame, setCreatingGame] =
        useState(false);

    const [boardRows, setBoardRows] =
        useState(5);

    const [boardColumns, setBoardColumns] =
        useState(5);

    const [maxDays, setMaxDays] =
        useState(10);

    const [maxInitialGrass, setMaxInitialGrass] =
        useState(5);

    const [maxInitialSheep, setMaxInitialSheep] =
        useState(3);

    const [maxInitialWolves, setMaxInitialWolves] =
        useState(2);


    useEffect(() => {

        async function fetchGameSessions() {

            try {

                const token =
                    localStorage.getItem("token");

                const result = await fetch(
                    "http://localhost:5000/api/game-sessions",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await result.json();

                console.log(
                    "Game sessions:",
                    data
                );

                if (result.ok) {
                    setGameSessions(
                        data.gameSessions
                    );
                }

            } catch (error) {

                console.error(
                    "Failed to fetch games:",
                    error
                );
            }
        }

        fetchGameSessions();

    }, []);


    async function createGame() {

        try {

            setCreatingGame(true);

            const token =
                localStorage.getItem("token");

            const result = await fetch(
                "http://localhost:5000/api/game-sessions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        boardRows:
                            Number(boardRows),

                        boardColumns:
                            Number(boardColumns),

                        maxDays:
                            Number(maxDays),

                        maxInitialGrass:
                            Number(maxInitialGrass),

                        maxInitialSheep:
                            Number(maxInitialSheep),

                        maxInitialWolves:
                            Number(maxInitialWolves)
                    })
                }
            );

            const data =
                await result.json();

            console.log(
                "Created game:",
                data
            );

            if (!result.ok) {

                throw new Error(
                    data.message
                );
            }

            setGameSessions(
                (previousGames) => [
                    data.gameSession,
                    ...previousGames
                ]
            );

        } catch (error) {

            console.error(
                "Create game failed:",
                error
            );

        } finally {

            setCreatingGame(false);
        }
    }

    // console.log("SESSION:", session);
    return (

        <div>

            <h1>Dashboard</h1>

            <h2>
                Welcome, {user.username}!
            </h2>

            <h3>
                Create New Game
            </h3>


            <div>

                <label>
                    Board Rows:

                    <input
                        type="number"
                        min="1"
                        value={boardRows}
                        onChange={(event) =>
                            setBoardRows(
                                event.target.value
                            )
                        }
                    />
                </label>


                <label>
                    Board Columns:

                    <input
                        type="number"
                        min="1"
                        value={boardColumns}
                        onChange={(event) =>
                            setBoardColumns(
                                event.target.value
                            )
                        }
                    />
                </label>


                <label>
                    Max Days:

                    <input
                        type="number"
                        min="1"
                        value={maxDays}
                        onChange={(event) =>
                            setMaxDays(
                                event.target.value
                            )
                        }
                    />
                </label>


                <label>
                    Max Initial Grass:

                    <input
                        type="number"
                        min="0"
                        value={maxInitialGrass}
                        onChange={(event) =>
                            setMaxInitialGrass(
                                event.target.value
                            )
                        }
                    />
                </label>


                <label>
                    Max Initial Sheep:

                    <input
                        type="number"
                        min="0"
                        value={maxInitialSheep}
                        onChange={(event) =>
                            setMaxInitialSheep(
                                event.target.value
                            )
                        }
                    />
                </label>


                <label>
                    Max Initial Wolves:

                    <input
                        type="number"
                        min="0"
                        value={maxInitialWolves}
                        onChange={(event) =>
                            setMaxInitialWolves(
                                event.target.value
                            )
                        }
                />

                </label>

            </div>


            <button
                onClick={createGame}
                disabled={creatingGame}
            >
                {
                    creatingGame
                        ? "Creating..."
                        : "Create New Game"
                }
            </button>


            <h3>
                Your Games
            </h3>


            {gameSessions.map((game) => (

                <GameCard
                    key={game.id}
                    game={game}
                />

            ))}

        </div>
    );
}

export default Dashboard;