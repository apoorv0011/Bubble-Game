var scorern = 0;
var nt;
var level = 1;
var timer = 60;
var timerInterval;
var isPaused = false;
var playerName = "Guest";
var suggestedBubble = null;

const bgMusic = document.getElementById('bg-music');
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highscore").textContent = highScore;

function makeBubble(level) {
    let repeat = "";
    let j = level === 1 ? 25 : level === 2 ? 50 : 100;
    let numbers = Array.from({ length: 10 }, (_, i) => i);

    while (numbers.length < j) {
        numbers.push(Math.floor(Math.random() * 10));
    }

    let firstTen = numbers.slice(0, 10);
    let remainingNumbers = numbers.slice(10).sort(() => Math.random() - 0.5);
    numbers = [...firstTen, ...remainingNumbers];

    numbers.forEach((num) => {
        repeat += `<div class="bubble">${num}</div>`;
    });

    document.querySelector("#pbtm").innerHTML = repeat;
    autoResizeBubbles();
    suggestBestMove();
}

function increaseScore(points) {
    scorern += points;
    document.querySelector("#score").textContent = scorern;

    if (scorern > highScore) {
        highScore = scorern;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highscore").textContent = highScore;
    }

    if (scorern % 50 === 0) level++;
    makeBubble(level);
    changeHit();
}

function changeHit() {
    nt = Math.floor(Math.random() * 10);
    document.querySelector("#hitnum").textContent = nt;
    suggestBestMove();
}

function runTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            if (timer >= 0) {
                document.querySelector("#time").textContent = timer--;
            } else {
                clearInterval(timerInterval);
                endGame();
            }
        }
    }, 1000);
}

function heuristic(bubble) {
    return Math.abs(nt - Number(bubble.textContent));
}

function findBestBubble() {
    let bubbles = document.querySelectorAll(".bubble");
    let bestBubble = null;
    let minCost = Infinity;

    bubbles.forEach((bubble) => {
        let g = 1;
        let h = heuristic(bubble);
        let f = g + h;

        if (h === 0) {
            bestBubble = bubble;
            return;
        }

        if (f < minCost) {
            minCost = f;
            bestBubble = bubble;
        }
    });

    return bestBubble;
}

function suggestBestMove() {
    document.querySelectorAll(".bubble").forEach((bubble) => {
        bubble.style.border = "none";
    });

    suggestedBubble = findBestBubble();
    if (suggestedBubble) {
        suggestedBubble.style.border = "4px solid red";
    }
}

document.querySelector("#pbtm").addEventListener("click", function (e) {
    if (e.target.classList.contains("bubble")) {
        let selectedNum = Number(e.target.textContent);
        if (selectedNum === nt) {
            if (e.target === suggestedBubble) {
                increaseScore(5);
            } else {
                increaseScore(10);
            }
        }
    }
});

// function startGame() {
//     document.getElementById("welcome-screen").style.display = "none";
//     document.getElementById("main").style.display = "flex";
//     document.getElementById("playerDisplay").textContent = playerName;
//     bgMusic.play();
//     makeBubble(level);
//     runTimer();
//     changeHit();
// }

function startGame() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("main").style.display = "flex";
  document.getElementById("playerDisplay").textContent = playerName;

  bgMusic.currentTime = 0;   // Start from beginning
  bgMusic.volume = 0.5;      // Not too loud
  bgMusic.play().catch(error => {
      console.log("Music play error:", error);
  });

  makeBubble(level);
  runTimer();
  changeHit();
}


function resetGame() {
    scorern = 0;
    timer = 60;
    level = 1;
    isPaused = false;
    suggestedBubble = null;

    document.querySelector("#score").textContent = "0";
    document.querySelector("#time").textContent = "60";
    document.querySelector("#hitnum").textContent = "0";
}

function endGame() {
    document.querySelector("#pbtm").innerHTML = `
        <div style="text-align: center; width: 100%;">
            <h1>Game Over, ${playerName}!</h1>
            <button id="play-again-btn" style="
                padding: 15px 30px;
                font-size: 1.2rem;
                margin-top: 20px;
                background: #27ae60;
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
            ">
                Play Again
            </button>
        </div>
    `;
    bgMusic.pause();

    document.getElementById("play-again-btn").addEventListener("click", () => {
        resetGame();
        startGame();
    });
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-overlay').style.display = isPaused ? "flex" : "none";
    isPaused ? bgMusic.pause() : bgMusic.play();
}

function toggleMute() {
    bgMusic.muted = !bgMusic.muted;
}

function autoResizeBubbles() {
    let bubbles = document.querySelectorAll(".bubble");
    let panel = document.getElementById("pbtm");
    let totalArea = panel.clientWidth * panel.clientHeight;
    let bubbleArea = bubbles.length * (60 * 60);

    if (bubbleArea > totalArea * 0.7) {
        bubbles.forEach(bubble => {
            bubble.style.height = "40px";
            bubble.style.width = "40px";
            bubble.style.fontSize = "1rem";
        });
    }
}

document.getElementById("start-btn").addEventListener("click", () => {
    const inputName = document.getElementById("player-name").value.trim();
    if (inputName) playerName = inputName;
    startGame();
});

document.getElementById("pause-btn").addEventListener("click", togglePause);
document.getElementById("resume-btn").addEventListener("click", togglePause);
document.getElementById("mute-btn").addEventListener("click", toggleMute);
