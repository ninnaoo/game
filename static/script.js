window.onload = () => {
  const loading = document.getElementById("loading");
  loading.style.display = "none"; // скрываем overlay
};
const loadingOverlay = document.getElementById("loadingOverlay");
const startBtn = document.getElementById("startBtn");

const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");
const messageText = document.getElementById("messageText");
const restartBtn = document.getElementById("restartBtn");

const rotateOverlay = document.getElementById("rotateOverlay");
const gameContainer = document.getElementById("gameContainer");
const music = document.getElementById("bgMusic");

let score = 0;
let spawned = 0;
let gameOver = false;
const finishScore = 16;
let gameStarted = false;



// прыжок
function jump() {
  if (!player.classList.contains("jump")) {
    player.classList.add("jump");
    setTimeout(() => player.classList.remove("jump"), 600);
  }
}
document.body.addEventListener("keydown", e => { if (e.code === "Space") jump(); });
document.body.addEventListener("touchstart", jump);

// музыка после клика
document.body.addEventListener("click", () => {
  music.muted = false;
  music.play();
}, { once: true });

// проверка ориентации ДО загрузки
function checkOrientationBeforeLoading() {
  if (window.innerWidth > window.innerHeight) {
    // горизонтально → показываем загрузку
    rotateOverlay.style.display = 'none';
    loadingOverlay.style.display = 'flex';
  } else {
    // вертикально → показываем просьбу повернуть
    rotateOverlay.style.display = 'flex';
    loadingOverlay.style.display = 'none';
  }
}

// проверка ориентации в реальном времени после старта игры
function checkOrientationDuringGame() {
  if (!gameStarted) return;
  if (window.innerWidth > window.innerHeight) {
    rotateOverlay.style.display = 'none';
    gameContainer.style.display = 'block';
  } else {
    rotateOverlay.style.display = 'flex';
    gameContainer.style.display = 'none';
  }
}

// запускаем проверку ДО загрузки
checkOrientationBeforeLoading();
window.addEventListener('resize', () => {
  checkOrientationBeforeLoading();
  checkOrientationDuringGame();
});
window.addEventListener('orientationchange', () => {
  checkOrientationBeforeLoading();
  checkOrientationDuringGame();
});

// старт игры
function startGame() {
  gameStarted = true;
  score = 0;
  spawned = 0;
  gameOver = false;
  scoreEl.textContent = "Пройдено: 0";
  message.style.display = "none";
  restartBtn.style.display = "none";

  // удалить старые препятствия
  document.querySelectorAll(".obstacle").forEach(o => o.remove());

  // скрываем загрузку
  loadingOverlay.style.display = 'none';
  gameContainer.style.display = 'block';

  spawnGroup(2, 1000);
  spawnObstacle();
}

function spawnGroup(count, interval) {
  for (let i = 0; i < count; i++) {
    setTimeout(spawnObstacle, i * interval);
  }
}

function spawnObstacle() {
  if (gameOver) return;
  if (spawned >= finishScore) return;

  spawned++;
  const obstacle = document.createElement("img");
  obstacle.src = "static/star.png";
  obstacle.className = "obstacle";
  game.appendChild(obstacle);

  const checkCollision = setInterval(() => {
    const playerRect = player.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();
    if (
      playerRect.left < obsRect.right &&
      playerRect.right > obsRect.left &&
      playerRect.bottom > obsRect.top &&
      playerRect.top < obsRect.bottom
    ) {
      gameOver = true;
      message.style.display = "flex";
      messageText.innerHTML = "проигрыш ((";
      restartBtn.style.display = "inline-block";
      clearInterval(checkCollision);
    }
  }, 30);

  obstacle.addEventListener("animationend", () => {
    if (!gameOver) {
      score++;
      scoreEl.textContent = "Пройдено: " + score;
      if (score >= finishScore) {gameOver = true;
        message.style.display = "flex";
        messageText.innerHTML = "тут будет текст поздравления :)";
        restartBtn.style.display = "inline-block";
      }
    }
    obstacle.remove();
    clearInterval(checkCollision);
    if (!gameOver && spawned < finishScore) {
      setTimeout(spawnObstacle, 400 + Math.random() * 400);
    }
  });
}

// кнопка рестарта
restartBtn.addEventListener("click", startGame);

// кнопка «Начать игру»
startBtn.addEventListener('click', startGame);

// показываем загрузку после полной загрузки страницы, только если горизонтально

