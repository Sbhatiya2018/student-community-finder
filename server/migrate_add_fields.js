require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log("Adding new columns...");

        await client.query("ALTER TABLE communities ADD COLUMN IF NOT EXISTS source_country TEXT");
        await client.query("ALTER TABLE communities ADD COLUMN IF NOT EXISTS university TEXT");
        await client.query("ALTER TABLE communities ADD COLUMN IF NOT EXISTS intake TEXT");

        console.log("New columns added successfully!");
    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        client.release();
        pool.end();
    }
};

migrate();
