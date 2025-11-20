import fs from "fs";
import path from "path";

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "POST only" });
    }

    const filePath = path.join("/tmp", "leaderboard.json");

    // Extract score
    const { score } = req.body;

    if (typeof score !== "number" || score <= 0) {
        return res.status(400).json({ error: "Invalid score" });
    }

    // Load existing scores
    let scores = [];
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, "utf8");
            scores = JSON.parse(data);
        } catch {
            scores = [];
        }
    }

    // Add + sort + limit
    scores.push(score);
    scores = scores.sort((a, b) => b - a).slice(0, 50);

    // Save updated leaderboard
    fs.writeFileSync(filePath, JSON.stringify(scores), "utf8");

    return res.json({ success: true, scores });
}
