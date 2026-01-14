const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Student Community Finder API is running. Access endpoints at /api/communities');
});

// Get all communities
app.get('/api/communities', async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM communities");
        // Transform keys to match frontend expectation (tags object)
        const communities = rows.map(mapRowToCommunity);
        res.json({ data: communities });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Create new community
app.post('/api/communities', async (req, res) => {
    const { name, platform, link, tags } = req.body;
    // Simple validation
    if (!name || !platform || !link) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    const sql = "INSERT INTO communities (name, platform, link, country, field, courseType, source_country, university, intake) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    const params = [
        name,
        platform,
        link,
        tags?.country || 'Global',
        tags?.field || '',
        tags?.courseType || '',
        tags?.sourceCountry || '',
        tags?.university || '',
        tags?.intake || ''
    ];

    try {
        const { rows } = await db.query(sql, params);
        res.json({
            message: "success",
            data: mapRowToCommunity(rows[0])
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update community
app.put('/api/communities/:id', async (req, res) => {
    const id = req.params.id;
    const { name, platform, link, tags } = req.body;

    const sql = `UPDATE communities 
                 SET name = $1, platform = $2, link = $3, country = $4, field = $5, courseType = $6, source_country = $7, university = $8, intake = $9 
                 WHERE id = $10 RETURNING *`;

    const params = [
        name,
        platform,
        link,
        tags?.country || 'Global',
        tags?.field || '',
        tags?.courseType || '',
        tags?.sourceCountry || '',
        tags?.university || '',
        tags?.intake || '',
        id
    ];

    try {
        const { rows } = await db.query(sql, params);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Community not found" });
        }
        res.json({
            message: "updated",
            data: mapRowToCommunity(rows[0])
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Helper to map DB row to frontend object structure
function mapRowToCommunity(row) {
    return {
        id: row.id,
        name: row.name,
        platform: row.platform,
        link: row.link,
        tags: {
            country: row.country,
            field: row.field,
            courseType: row.coursetype, // Postgres lowercases columns
            sourceCountry: row.source_country,
            university: row.university,
            intake: row.intake
        }
    };
}

// Delete community
app.delete('/api/communities/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { rowCount } = await db.query("DELETE FROM communities WHERE id = $1", [id]);
        res.json({ message: "deleted", changes: rowCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Export app for Vercel
module.exports = app;

// Only listen if executed directly (not when imported as a module by Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
