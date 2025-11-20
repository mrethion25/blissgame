import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
    try {
        const result = await pool.query(
            "SELECT score FROM leaderboard ORDER BY score DESC LIMIT 50"
        );

        const scores = result.rows.map(r => r.score);
        res.json({ scores });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}
