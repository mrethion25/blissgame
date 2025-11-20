var board;
var score = 0;
var rows = 4;
var columns = 4;
var highScore = 0;
var gameStarted = false;

window.onload = function() {
    loadPublicLeaderboard(); // Load public leaderboard when page loads
};
    // Load highScore from localStorage
    highScore = Number(localStorage.getItem("2048-highScore")) || 0;
    document.getElementById("highScore").innerText = highScore;

    // Render blank board on load
    renderBlankBoard();

    // Start Game button logic
    document.getElementById("startBtn").onclick = function() {
        document.getElementById("hintPop").classList.remove("hidden");
        document.getElementById("mainContent").classList.add("blur");
    };

    // Hide hint and start game on OK
    document.getElementById("hintOkBtn").onclick = function() {
        document.getElementById("hintPop").classList.add("hidden");
        document.getElementById("mainContent").classList.remove("blur");
        score = 0;
        document.getElementById("score").innerText = score;
        setGame();
        setTwo();
        setTwo();
        document.getElementById("startBtn").style.display = "none";
        document.getElementById("restartBtn").style.display = "inline-block";
        gameStarted = true;
    };

    // Restart button logic
    document.getElementById("restartBtn").onclick = function() {
        score = 0;
        document.getElementById("score").innerText = score;
        setGame();
        setTwo();
        setTwo();
        hideGameOver();
        gameStarted = true;
    };

    // Play Again button in Game Over popup
    document.getElementById("playAgainBtn").onclick = function() {
        document.getElementById("restartBtn").click();
        document.getElementById("restartBtn").style.display = "inline-block"; // <-- Add this line
    };
};

function renderBlankBoard() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    document.getElementById("board").innerHTML = "";
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            updateTile(tile, 0);
            document.getElementById("board").append(tile);
        }
    }
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    document.getElementById("board").innerHTML = "";
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            updateTile(tile, 0);
            document.getElementById("board").append(tile);
        }
    }
}

function hasEmptyTile() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if(!hasEmptyTile()) {
        return;
    }
    let found = false;
    while(!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if(board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if(num > 0) {
        tile.innerText = num;
        if(num <= 4096) {
            tile.classList.add("x"+num.toString());
        }else{
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (!gameStarted) return;
    if(document.getElementById("gameOverModal") && !document.getElementById("gameOverModal").classList.contains("hidden")) return;

    let moved = false;
    if(e.key == "ArrowLeft") {
        moved = slideLeft();
    } else if(e.key == "ArrowRight") {
        moved = slideRight();
    } else if(e.key == "ArrowUp") {
        moved = slideUp();
    } else if(e.key == "ArrowDown") {
        moved = slideDown();
    }
    if(moved) setTwo();

    document.getElementById("score").innerText =  score;
    if(score > highScore) {
        highScore = score;
        document.getElementById("highScore").innerText = highScore;
        localStorage.setItem("2048-highScore", highScore);
    }

    // Check for game over
    if (!canMove()) {
        showGameOver();
    }
});

// --- Swipe support for mobile ---
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;

document.getElementById("board").addEventListener("touchstart", function(e) {
    if (!gameStarted) return;
    if(e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
});

document.getElementById("board").addEventListener("touchend", function(e) {
    if (!gameStarted) return;
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

document.getElementById("board").addEventListener("touchmove", function(e) {
    if (!gameStarted) return;
    e.preventDefault();
}, { passive: false });

function handleSwipe() {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    let moved = false;
    if(Math.abs(dx) > Math.abs(dy)) {
        if(dx > 30) {
            slideRight(); setTwo(); moved = true;
        } else if(dx < -30) {
            slideLeft(); setTwo(); moved = true;
        }
    } else {
        if(dy > 30) {
            slideDown(); setTwo(); moved = true;
        } else if(dy < -30) {
            slideUp(); setTwo(); moved = true;
        }
    }
    if(moved) {
        document.getElementById("score").innerText = score;
        if(score > highScore) {
            highScore = score;
            document.getElementById("highScore").innerText = highScore;
            localStorage.setItem("2048-highScore", highScore);
        }
        if (!canMove()) {
            showGameOver();
        }
    }
}

// --- Game logic helpers (slideLeft, slideRight, slideUp, slideDown, filterZero, slide) ---
// (You should keep your existing implementations for these functions)

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for(let i = 0; i < row.length - 1; i++) {
        if(row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row  = filterZero(row);
    while(row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    let moved = false;
    for(let r = 0; r < rows; r++) {
        let oldRow = [...board[r]];
        let row = slide(board[r]);
        board[r] = row;
        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if(JSON.stringify(oldRow) !== JSON.stringify(row)) moved = true;
    }
    return moved;
}
function slideRight() {
    let moved = false;
    for(let r = 0; r < rows; r++) {
        let oldRow = [...board[r]];
        let row = [...board[r]].reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        for(let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if(JSON.stringify(oldRow) !== JSON.stringify(row)) moved = true;
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for(let c = 0; c < columns; c++){
        let oldCol = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for(let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if(JSON.stringify(oldCol) !== JSON.stringify(row)) moved = true;
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for(let c = 0; c < columns; c++){
        let oldCol = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
        row = slide(row);
        row.reverse();
        for(let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if(JSON.stringify(oldCol) !== JSON.stringify(row)) moved = true;
    }
    return moved;
}

// --- Game Over Modal ---
function canMove() {
    if (hasEmptyTile()) return true;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let val = board[r][c];
            if (r < rows - 1 && board[r+1][c] === val) return true;
            if (c < columns - 1 && board[r][c+1] === val) return true;
        }
    }
    return false;
}

async function showGameOver() {
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverModal").classList.remove("hidden");
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("mainContent").classList.add("blur");
    gameStarted = false;

    // PUBLIC leaderboard
    await submitPublicScore(score);

    // Load global leaderboard
    const scores = await loadPublicLeaderboard();

    // Update "Your current score + rank"
    let rank = scores.indexOf(score) + 1;
    if (rank < 1) rank = scores.length;

    const ys = document.getElementById("yourScore");
    ys.textContent = `Your current score: ${score} (Rank: #${rank})`;
         }
function hideGameOver() {
    document.getElementById("gameOverModal").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("blur");
}

// --- Emoji Footer Animation ---
const emojiList = ["🦄", "🦅", "❤️", "👀", "💗", "💅🏻", "💖", "🌟", "😎", "🙌", "🎮", "🍀", "🔥", "💯", "🤩"];
const footer = document.getElementById("emojiFooter");

function spawnEmoji() {
    const emoji = document.createElement("span");
    emoji.className = "emoji-float";
    emoji.innerText = emojiList[Math.floor(Math.random() * emojiList.length)];
    emoji.style.left = Math.random() * 80 + "vw";
    emoji.style.fontSize = (Math.random() * 1.2 + 1.2) + "rem";
    footer.appendChild(emoji);
    emoji.addEventListener("animationend", () => {
        emoji.remove();
    });
}

setInterval(spawnEmoji, 1200);
async function submitPublicScore(score) {
    try {
        await fetch("/api/submit-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score })
        });
    } catch (e) {
        console.error("Submit failed:", e);
    }
}

async function loadPublicLeaderboard() {
    try {
        const res = await fetch("/api/get-leaderboard");
        const data = await res.json();
        const scores = data.scores || [];

        const lb = document.getElementById("leaderboard");
        lb.innerHTML = "";

        scores.forEach((s, i) => {
            const li = document.createElement("li");
            li.textContent = `#${i + 1} — ${s}`;
            lb.appendChild(li);
        });

        return scores;
    } catch (e) {
        console.error("Load failed:", e);
        return [];
    }
}






