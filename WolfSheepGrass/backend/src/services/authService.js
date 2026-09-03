const { OAuth2Client } = require("google-auth-library");
const pool = require("../db/database");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function authenticateWithGoogle(credential) {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const username = payload.name || email.split("@")[0];
    const profilePicture = payload.picture || null;

    const result = await pool.query(
        `
        INSERT INTO users (google_id, email, username, profile_picture)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (google_id)
        DO UPDATE SET
            email = EXCLUDED.email,
            username = EXCLUDED.username,
            profile_picture = EXCLUDED.profile_picture,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, google_id, email, username, profile_picture
        `,
        [googleId, email, username, profilePicture]
    );

    return result.rows[0];
}

module.exports = {
    authenticateWithGoogle
};