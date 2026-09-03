const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


async function withTransaction(callback) {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await callback(client);

        await client.query("COMMIT");

        return result;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {
        client.release();
    }
}

module.exports = pool;
module.exports.withTransaction = withTransaction;
