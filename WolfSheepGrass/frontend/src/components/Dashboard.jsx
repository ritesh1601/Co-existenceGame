import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import GameCard from "./GameCard";

function Dashboard() {
    const { user } = useAuth();
    const [gameSessions, setGameSessions] = useState([]);
    const [creatingGame, setCreatingGame] = useState(false);

    useEffect(() => {
        async function fetchGameSessions() {
            const token = localStorage.getItem("token");

            const result = await fetch(
                "http://localhost:5000/api/game-sessions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await result.json();

            console.log("Game sessions:", data);

            if (result.ok) {
                setGameSessions(data.gameSessions);
            }
        }

        fetchGameSessions();
    }, []);

    async function createGame() {
        try {
            setCreatingGame(true);

            const token = localStorage.getItem("token");

            const result = await fetch(
                "http://localhost:5000/api/game-sessions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        boardRows: 5,
                        boardColumns: 5,
                        maxDays: 10
                    })
                }
            );

            const data = await result.json();

            console.log("Created game:", data);

            if (!result.ok) {
                throw new Error(data.message);
            }

            setGameSessions((previousGames) => [
                data.gameSession,
                ...previousGames
            ]);

        } catch (error) {
            console.error("Create game failed:", error);
        } finally {
            setCreatingGame(false);
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>Welcome, {user.username}!</h2>

            <h3>Your Games</h3>

            <button onClick={createGame} disabled={creatingGame}>
                {creatingGame ? "Creating..." : "Create New Game"}
            </button>

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