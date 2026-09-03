CREATE TABLE IF NOT EXISTS game_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'won', 'lost', 'abandoned')),
    board_rows INTEGER NOT NULL DEFAULT 5 CHECK (board_rows > 0),
    board_columns INTEGER NOT NULL DEFAULT 5 CHECK (board_columns > 0),
    current_day INTEGER NOT NULL DEFAULT 0 CHECK (current_day >= 0),
    max_days INTEGER NOT NULL DEFAULT 10 CHECK (max_days > 0),
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (current_day <= max_days)
);

CREATE INDEX IF NOT EXISTS game_sessions_user_id_idx
    ON game_sessions(user_id);

CREATE INDEX IF NOT EXISTS game_sessions_user_status_idx
    ON game_sessions(user_id, status);
