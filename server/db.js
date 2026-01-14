require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: isProduction ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(connectionConfig);

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database.');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const initialData = [
    {
        name: "USA Masters Connect 2024",
        platform: "Discord",
        link: "https://discord.com",
        country: "USA",
        field: "General",
        courseType: "Masters"
    },
    {
        name: "UK Undergrad Hub",
        platform: "WhatsApp",
        link: "https://whatsapp.com",
        country: "UK",
        field: "General",
        courseType: "Undergraduate"
    },
    {
        name: "Canada Tech Students",
        platform: "Slack",
        link: "https://slack.com",
        country: "Canada",
        field: "Technology",
        courseType: "Diploma"
    },
    {
        name: "Global Student Lounge",
        platform: "WhatsApp",
        link: "https://whatsapp.com",
        country: "Global",
        field: "General",
        courseType: "General"
    },
    {
        name: "German Engineering Network",
        platform: "Telegram",
        link: "https://telegram.org",
        country: "Germany",
        field: "Engineering",
        courseType: "Masters"
    }
];

const initDb = async () => {
    const client = await pool.connect();
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS communities (
            id SERIAL PRIMARY KEY,
            name TEXT,
            platform TEXT,
            link TEXT,
            country TEXT,
            field TEXT,
            courseType TEXT,
            source_country TEXT,
            university TEXT,
            intake TEXT
        )`);

        const res = await client.query("SELECT count(*) as count FROM communities");
        const count = parseInt(res.rows[0].count);

        if (count === 0) {
            console.log("Seeding database...");
            const insertText = 'INSERT INTO communities (name, platform, link, country, field, courseType) VALUES ($1, $2, $3, $4, $5, $6)';

            for (const comm of initialData) {
                await client.query(insertText, [comm.name, comm.platform, comm.link, comm.country, comm.field, comm.courseType]);
            }
            console.log("Database seeded!");
        } else {
            console.log("Database already exists, skipping seed.");
        }
    } catch (err) {
        console.error("Error initializing database:", err.message);
    } finally {
        client.release();
    }
};

initDb();

module.exports = {
    query: (text, params) => pool.query(text, params),
};
