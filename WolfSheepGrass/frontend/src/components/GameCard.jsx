import { useNavigate } from "react-router-dom";

function GameCard({ game }) {
    const navigate = useNavigate();

    function openGame() {
        navigate(`/game/${game.id}`);
    }

    return (
        <div onClick={openGame}>
            <h3>Game #{game.id}</h3>

            <p>
                Day {game.current_day} / {game.max_days}
            </p>

            <p>
                Status: {game.status}
            </p>
        </div>
    );
}

export default GameCard;