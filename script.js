const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playerSize = 20;
let playerX = 50;
let playerY = 50;
const speed = 5;
const levels = [
  [
    { x: 150, y: 0, width: 20, height: 300 },
    { x: 300, y: 100, width: 20, height: 300 },
    { x: 450, y: 0, width: 20, height: 250 },
  ],
  [
    { x: 100, y: 50, width: 20, height: 300 },
    { x: 250, y: 0, width: 20, height: 200 },
    { x: 400, y: 150, width: 20, height: 300 },
  ],
  [
    { x: 200, y: 0, width: 20, height: 150 },
    { x: 300, y: 200, width: 20, height: 200 },
    { x: 450, y: 50, width: 20, height: 300 },
  ],
];
let currentLevel = 0;
const exit = { x: 560, y: 360, width: 20, height: 20 };
const overlay = document.getElementById("overlay");

// Load game state from localStorage
function loadGameState() {
  const savedState = JSON.parse(localStorage.getItem("gameState"));
  if (savedState) {
    playerX = savedState.playerX || 50;
    playerY = savedState.playerY || 50;
    currentLevel = savedState.currentLevel || 0;
  }
}

// Save game state to localStorage
function saveGameState() {
  const gameState = {
    playerX,
    playerY,
    currentLevel,
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function startGame() {
  loadGameState();
  document.getElementById("startPage").style.display = "none";
  canvas.style.display = "block";
  gameLoop();
}

function drawPlayer() {
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(playerX, playerY, playerSize, playerSize);
}

function drawObstacles() {
  ctx.fillStyle = "#FF3D00";
  levels[currentLevel].forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawExit() {
  ctx.fillStyle = "#00E676";
  ctx.fillRect(exit.x, exit.y, exit.width, exit.height);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCollisions() {
  return levels[currentLevel].some(
    (obstacle) =>
      playerX < obstacle.x + obstacle.width &&
      playerX + playerSize > obstacle.x &&
      playerY < obstacle.y + obstacle.height &&
      playerY + playerSize > obstacle.y
  );
}

function checkExit() {
  if (
    playerX < exit.x + exit.width &&
    playerX + playerSize > exit.x &&
    playerY < exit.y + exit.height &&
    playerY + playerSize > exit.y
  ) {
    overlay.classList.add("show");
  }
}

function restartGame() {
  overlay.classList.remove("show");
  playerX = 50;
  playerY = 50;
  saveGameState();
  requestAnimationFrame(gameLoop);
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) {
    alert("You've completed all levels! Great job!");
    currentLevel = 0;
  }
  saveGameState();
  restartGame();
}

function gameLoop() {
  clearCanvas();
  drawPlayer();
  drawObstacles();
  drawExit();
  checkExit();

  if (!overlay.classList.contains("show")) {
    saveGameState();
    requestAnimationFrame(gameLoop);
  }
}

window.addEventListener("keydown", (event) => {
  if (overlay.classList.contains("show")) return;
  const { key } = event;
  let newX = playerX;
  let newY = playerY;

  switch (key) {
    case "ArrowUp":
      newY -= speed;
      break;
    case "ArrowDown":
      newY += speed;
      break;
    case "ArrowLeft":
      newX -= speed;
      break;
    case "ArrowRight":
      newX += speed;
      break;
  }

  const originalX = playerX;
  const originalY = playerY;
  playerX = newX;
  playerY = newY;

  if (checkCollisions()) {
    playerX = originalX;
    playerY = originalY;
  }
});
