var board;
var score = 0;
var rows = 4;
var columns = 4;
var highScore = 0;
var gameStarted = false;

/* ============================================
   WINDOW ONLOAD (ALL INIT GOES HERE)
   ============================================ */
window.onload = function () {

    // Load leaderboard when page opens
    loadPublicLeaderboard();

    // Load highScore
    highScore = Number(localStorage.getItem("2048-highScore")) || 0;
    document.getElementById("highScore").innerText = highScore;

    // Render blank board
    renderBlankBoard();

    /* ===== Start Button ===== */
    document.getElementById("startBtn").onclick = function () {
        document.getElementById("hintPop").classList.remove("hidden");
        document.getElementById("mainContent").classList.add("blur");
    };

    /* ===== OK on Hint ===== */
    document.getElementById("hintOkBtn").onclick = function () {
        document.getElementById("hintPop").classList.add("hidden");
        document.getElementById("mainContent").classList.remove("blur");

        startNewGame();
    };

    /* ===== Restart Button ===== */
    document.getElementById("restartBtn").onclick = function () {
        hideGameOver();
        startNewGame();
    };

    /* ===== Play Again ===== */
    document.getElementById("playAgainBtn").onclick = function () {
        hideGameOver();
        startNewGame();
    };
};

/* ============================================
   START NEW GAME
   ============================================ */
function startNewGame() {
    score = 0;
    document.getElementById("score").innerText = score;

    setGame();
    setTwo();
    setTwo();

    document.getElementById("startBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "inline-block";

    gameStarted = true;
}

/* ============================================
   BLANK BOARD RENDER
   ============================================ */
function renderBlankBoard() {
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    document.getElementById("board").innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            updateTile(tile, 0);
            document.getElementById("board").append(tile);
        }
    }
}

/* ============================================
   SET GAME
   ============================================ */
function setGame() {
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    document.getElementById("board").innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            updateTile(tile, 0);
            document.getElementById("board").append(tile);
        }
    }
}

/* ============================================
   TILE HELPERS
   ============================================ */
function hasEmptyTile() {
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < columns; c++)
            if (board[r][c] == 0) return true;

    return false;
}

function setTwo() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r + "-" + c);
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile";

    if (num > 0) {
        tile.innerText = num;
        tile.classList.add("x" + (num <= 4096 ? num : 8192));
    }
}

/* ============================================
   KEYBOARD CONTROLS
   ============================================ */
document.addEventListener("keyup", (e) => {
    if (!gameStarted) return;
    if (!document.getElementById("gameOverModal").classList.contains("hidden")) return;

    let moved = false;

    if (e.key == "ArrowLeft") moved = slideLeft();
    else if (e.key == "ArrowRight") moved = slideRight();
    else if (e.key == "ArrowUp") moved = slideUp();
    else if (e.key == "ArrowDown") moved = slideDown();

    if (moved) {
        setTwo();
        updateScore();
    }
});

/* ============================================
   SWIPE SUPPORT (MOBILE)
   ============================================ */
let touchStartX = 0, touchStartY = 0;

document.getElementById("board").addEventListener("touchstart", function (e) {
    if (!gameStarted) return;

    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.getElementById("board").addEventListener("touchend", function (e) {
    if (!gameStarted) return;

    let dx = e.changedTouches[0].clientX - touchStartX;
    let dy = e.changedTouches[0].clientY - touchStartY;

    let moved = false;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) moved = slideRight();
        else if (dx < -30) moved = slideLeft();
    } else {
        if (dy > 30) moved = slideDown();
        else if (dy < -30) moved = slideUp();
    }

    if (moved) {
        setTwo();
        updateScore();
    }
}, { passive: true });

/* ============================================
   SLIDE HELPERS
   ============================================ */
function filterZero(row) {
    return row.filter(n => n !== 0);
}

function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);
    while (row.length < columns) row.push(0);

    return row;
}

function slideLeft() {
    let moved = false;

    for (let r = 0; r < rows; r++) {
        let old = [...board[r]];
        let row = slide(board[r]);

        board[r] = row;

        for (let c = 0; c < columns; c++) {
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }

        if (JSON.stringify(old) !== JSON.stringify(row)) moved = true;
    }
    return moved;
}

function slideRight() {
    let moved = false;

    for (let r = 0; r < rows; r++) {
        let old = [...board[r]];
        let row = [...board[r]].reverse();

        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }

        if (JSON.stringify(old) !== JSON.stringify(row)) moved = true;
    }
    return moved;
}

function slideUp() {
    let moved = false;

    for (let c = 0; c < columns; c++) {
        let old = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let col = [...old];

        col = slide(col);

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateTile(document.getElementById(r + "-" + c), col[r]);
        }

        if (JSON.stringify(old) !== JSON.stringify(col)) moved = true;
    }
    return moved;
}

function slideDown() {
    let moved = false;

    for (let c = 0; c < columns; c++) {
        let old = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let col = [...old].reverse();

        col = slide(col);
        col.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }

        if (JSON.stringify(old) !== JSON.stringify(col)) moved = true;
    }
    return moved;
}

/* ============================================
   SCORE + GAME OVER
   ============================================ */
function updateScore() {
    document.getElementById("score").innerText = score;

    if (score > highScore) {
        highScore = score;
        document.getElementById("highScore").innerText = highScore;
        localStorage.setItem("2048-highScore", highScore);
    }

    if (!canMove()) showGameOver();
}

function canMove() {
    if (hasEmptyTile()) return true;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let v = board[r][c];
            if (r < 3 && board[r + 1][c] == v) return true;
            if (c < 3 && board[r][c + 1] == v) return true;
        }
    }
    return false;
}

async function showGameOver() {
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverModal").classList.remove("hidden");
    document.getElementById("mainContent").classList.add("blur");
    document.getElementById("restartBtn").style.display = "none";
    gameStarted = false;

    // Submit public leaderboard score
    await submitPublicScore(score);

    // Load updated leaderboard
    const scores = await loadPublicLeaderboard();

    // Rank
    let rank = scores.indexOf(score) + 1;
    if (rank < 1) rank = scores.length;

    const ys = document.getElementById("yourScore");
    ys.textContent = `Your current score: ${score} (Rank: #${rank})`;
}

function hideGameOver() {
    document.getElementById("gameOverModal").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("blur");
    document.getElementById("restartBtn").style.display = "inline-block";
}

/* ============================================
   PUBLIC LEADERBOARD API CALLS
   ============================================ */
async function submitPublicScore(score) {
    try {
        await fetch("/api/submit-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score })
        });
    } catch (e) {
        console.error("Error submitting score:", e);
    }
}

async function loadPublicLeaderboard() {
    try {
        const res = await fetch("/api/get-leaderboard");
        const data = await res.json();

        const scores = data.scores || [];
        const lb = document.getElementById("leaderboard");

        if (lb) {
            lb.innerHTML = "";
            scores.forEach((s, i) => {
                const li = document.createElement("li");
                li.textContent = `#${i + 1} — ${s}`;
                lb.appendChild(li);
            });
        }
        return scores;

    } catch (e) {
        console.error("Error loading leaderboard:", e);
        return [];
    }
}

/* ============================================
   EMOJI FOOTER ANIMATION
   ============================================ */
const emojiList = ["🦄", "🦅", "❤️", "👀", "💗", "💅🏻", "💖", "🌟", "😎", "🙌", "🎮", "🍀", "🔥", "💯", "🤩"];
const footer = document.getElementById("emojiFooter");

function spawnEmoji() {
    if (!footer) return;

    const e = document.createElement("span");
    e.className = "emoji-float";
    e.innerText = emojiList[Math.floor(Math.random() * emojiList.length)];

    e.style.left = Math.random() * 80 + "vw";
    e.style.fontSize = (Math.random() * 1.2 + 1.2) + "rem";

    footer.appendChild(e);

    e.addEventListener("animationend", () => e.remove());
}

setInterval(spawnEmoji, 1200);
