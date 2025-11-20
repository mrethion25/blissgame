// PUBLIC LEADERBOARD API (global)
// Stores leaderboard JSON in Vercel's /tmp directory

import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "POST only" });
    }

    const { score } = req.body;

    if (typeof score !== "number" || score < 0) {
        return res.status(400).json({ error: "Invalid score" });
    }

    const filePath = path.join("/tmp", "leaderboard.json");

    let scores = [];

    // Load existing leaderboard if exists
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf8");
        scores = JSON.parse(fileData);
    }

    // Add new score
    scores.push(score);

    // Sort & keep top 50
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 50);

    // Save
    fs.writeFileSync(filePath, JSON.stringify(scores), "utf8");

    return res.json({ success: true, scores });
                }
