import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const filePath = path.join("/tmp", "leaderboard.json");

    // If no file yet, return empty list
    if (!fs.existsSync(filePath)) {
        return res.json({ scores: [] });
    }

    try {
        const fileData = fs.readFileSync(filePath, "utf8");
        let scores = JSON.parse(fileData);

        // Sort descending + top 50
        scores = scores.sort((a, b) => b - a).slice(0, 50);

        return res.json({ scores });
    } catch (e) {
        return res.json({ scores: [] });
    }
}
