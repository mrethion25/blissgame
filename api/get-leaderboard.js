import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const filePath = path.join("/tmp", "leaderboard.json");

    if (!fs.existsSync(filePath)) {
        return res.json({ scores: [] });
    }

    const fileData = fs.readFileSync(filePath, "utf8");
    let scores = JSON.parse(fileData);

    return res.json({ scores });
}
