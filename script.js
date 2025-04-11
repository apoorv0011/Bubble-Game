var scorern = 0;
var nt;
var level = 1;

function makeBubble(level) {
  var repeat = "";
  var j = level === 1 ? 25 : level === 2 ? 50 : 100;

  let numbers = Array.from({ length: 10 }, (_, i) => i);

  while (numbers.length < j) {
    numbers.push(Math.floor(Math.random() * 10));
  }

  let firstTen = numbers.slice(0, 10);
  let remainingNumbers = numbers.slice(10);

  remainingNumbers = remainingNumbers.sort(() => Math.random() - 0.5);

  numbers = [...firstTen, ...remainingNumbers];

  numbers.forEach((num) => {
    repeat += `<div class="bubble">${num}</div>`;
  });

  document.querySelector("#pbtm").innerHTML = repeat;
  suggestBestMove();
}

function increaseScore() {
  scorern += 10;
  document.querySelector("#score").textContent = scorern;
  if (scorern % 50 == 0) {
    level++;
    makeBubble(level);
  }
  if (scorern > 150) {
    alert(`YOUR SCORE IS ${scorern}. YOU WON`);
  }
}

function changeHit() {
  nt = Math.floor(Math.random() * 10);
  document.querySelector("#hitnum").innerHTML = nt;
  suggestBestMove(); // Suggest new best move when hit number changes
}

function runTimer() {
  var timer = 60;
  var timerInt = setInterval(() => {
    if (timer >= 0) {
      document.querySelector("#time").textContent = timer--;
    } else {
      clearInterval(timerInt);
      document.querySelector("#pbtm").innerHTML = `<h1>GAME OVER</h1>`;
      alert(`YOUR SCORE IS ${scorern}`);
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

// Suggest the best move visually
function suggestBestMove() {
  document.querySelectorAll(".bubble").forEach((bubble) => {
    bubble.style.border = "none";
  });

  let bestBubble = findBestBubble();
  if (bestBubble) {
    bestBubble.style.border = "4px solid red"; // Highlight suggested move
  }
}

document.querySelector("#pbtm").addEventListener("click", function (res) {
  var selectedNum = Number(res.target.textContent);
  if (selectedNum == nt) {
    increaseScore();
    makeBubble(level);
    changeHit();
  }
});

function startgame() {
  makeBubble(level);
  runTimer();
  changeHit();
}

startgame();
