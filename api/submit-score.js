import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "POST only" });
    }

    const { score } = req.body;

    if (!score || typeof score !== "number") {
        return res.status(400).json({ error: "Invalid score" });
    }

    try {
        await pool.query(
            "INSERT INTO leaderboard (score) VALUES ($1)",
            [score]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}
