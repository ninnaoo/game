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

// музыка после клика
document.body.addEventListener("click", () => {
  music.muted = false;
  music.play();
}, { once: true });

// проверка ориентации
function checkOrientation() {
  if (window.matchMedia("(orientation: landscape)").matches) {
    rotateOverlay.style.display = "none";
    gameContainer.style.display = "block";
  } else {
    rotateOverlay.style.display = "flex";
    gameContainer.style.display = "none";
  }
}
checkOrientation();
window.addEventListener("orientationchange", checkOrientation);

// прыжок
function jump() {
  if (!player.classList.contains("jump")) {
    player.classList.add("jump");
    setTimeout(() => player.classList.remove("jump"), 600);
  }
}

document.body.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});
document.body.addEventListener("touchstart", jump);

// старт игры
function startGame() {
  score = 0;
  spawned = 0;
  gameOver = false;
  scoreEl.textContent = "Пройдено: 0";
  message.style.display = "none";
  restartBtn.style.display = "none";

  // удалить все старые препятствия
  document.querySelectorAll(".obstacle").forEach(o => o.remove());
    spawnGroup(2, 1000); // создаём 2 объекта с интервалом 0.3 сек
  spawnObstacle();
}
function spawnGroup(count, interval) {
  for (let i = 0; i < count; i++) {
    setTimeout(spawnObstacle, i * interval);
  }
}

// спавн препятствий
function spawnObstacle() {
  if (gameOver) return;
  if (spawned >= finishScore) return;

  spawned++;

  const obstacle = document.createElement("img");
  obstacle.src = "/../star.png";
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
      messageText.innerHTML = "😢 Ты проиграл!<br>Попробуй ещё раз!";
      restartBtn.style.display = "inline-block";
      clearInterval(checkCollision);
    }
  }, 30);

  obstacle.addEventListener("animationend", () => {
    if (!gameOver) {
      score++;
      scoreEl.textContent = "Пройдено: " + score;

      if (score >= finishScore) {
        gameOver = true;
        message.style.display = "flex";
        messageText.innerHTML = "🎂 Поздравляю с Днём Рождения! 🎉";
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

restartBtn.addEventListener("click", startGame);

// старт игры сразу при загрузке

startGame();


