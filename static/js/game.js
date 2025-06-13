'use strict';
// Kids Bike Racing game logic

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const hudTime = document.getElementById('hud-time');
const hudStars = document.getElementById('hud-stars');
const startPanel = document.getElementById('start-panel');
const endPanel = document.getElementById('end-panel');
const resultScore = document.getElementById('resultScore');
const leaderboardEl = document.getElementById('leaderboard');

const playerNameInput = document.getElementById('playerName');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');

const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnJump = document.getElementById('btnJump');

const PLAYER_X = canvas.width / 3; // keep player left of center
const GROUND_Y = canvas.height - 60;
const JUMP_VY = -350;
const GRAVITY = 900;
const SCROLL_SPEED = 200;
let accelerating = false;
const FINISH_DIST = 2000;

let lastTime = 0;
let running = false;
let timeRemaining = 60;
let starsCollected = 0;
let distance = 0;
let objects = []; // active stars and rocks

let playerY = GROUND_Y;
let vy = 0;
let spawnTimer = 0;

function startGame() {
  timeRemaining = 60;
  starsCollected = 0;
  distance = 0;
  objects = [];
  playerY = GROUND_Y;
  vy = 0;
  spawnTimer = 0;
  lastTime = performance.now();
  running = true;
  startPanel.hidden = true;
  endPanel.hidden = true;
  requestAnimationFrame(loop);
}

function endGame(msg) {
  running = false;
  const score = Math.max(0, Math.floor(timeRemaining * 5 + starsCollected * 10));
  resultScore.textContent = `${msg} Score: ${score}`;
  submitScore(playerNameInput.value || 'Anon', score).then(loadLeaderboard);
  endPanel.hidden = false;
}

function spawnObject() {
  const type = Math.random() < 0.5 ? 'star' : 'rock';
  const y = type === 'star' ? GROUND_Y - 40 - Math.random() * 100 : GROUND_Y;
  objects.push({ type, x: canvas.width + 40, y });
}

function update(dt) {
  spawnTimer += dt;
  if (spawnTimer > 0.7) {
    spawnTimer = 0;
    spawnObject();
  }

  // update objects
  const speed = accelerating ? SCROLL_SPEED * 1.5 : SCROLL_SPEED;
  objects.forEach(obj => {
    obj.x -= speed * dt;
  });
  objects = objects.filter(o => o.x > -50);

  // player physics
  vy += GRAVITY * dt;
  playerY += vy * dt;
  if (playerY > GROUND_Y) {
    playerY = GROUND_Y;
    vy = 0;
  }

  // Simple collision detection. If the bike overlaps
  // a star or a rock we take action.
  const px = PLAYER_X;
  objects = objects.filter(obj => {
    if (Math.abs(obj.x - px) < 30 && Math.abs(obj.y - playerY) < 30) {
      if (obj.type === 'star') {
        starsCollected++;
      } else {
        timeRemaining = Math.max(0, timeRemaining - 2);
      }
      return false;
    }
    return true;
  });

  distance += speed * dt;
  timeRemaining -= dt;

  if (timeRemaining <= 0) {
    endGame('Game Over!');
  }
  if (distance >= FINISH_DIST) {
    endGame('Finished!');
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background layers
  ctx.fillStyle = '#26c6da';
  ctx.fillRect(0, 0, canvas.width, canvas.height - 60);
  ctx.fillStyle = '#7c543e';
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

  // finish line
  if (FINISH_DIST - distance < canvas.width) {
    const x = canvas.width - (FINISH_DIST - distance);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, canvas.height - 120, 10, 60);
  }

  // draw objects
  objects.forEach(obj => {
    if (obj.type === 'star') {
      ctx.fillStyle = 'gold';
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'gray';
      ctx.fillRect(obj.x - 15, obj.y - 15, 30, 30);
    }
  });

  // player bike (simple circle + wheels)
  ctx.fillStyle = '#2196f3';
  ctx.fillRect(PLAYER_X - 15, playerY - 30, 30, 20);
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(PLAYER_X - 10, playerY - 10, 8, 0, Math.PI * 2);
  ctx.arc(PLAYER_X + 10, playerY - 10, 8, 0, Math.PI * 2);
  ctx.fill();

  hudTime.textContent = `Time: ${Math.ceil(timeRemaining)}`;
  hudStars.textContent = `Stars: ${starsCollected}`;
}

function loop(timestamp) {
  if (!running) return;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function jump() {
  if (playerY >= GROUND_Y - 1) {
    vy = JUMP_VY;
  }
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
btnJump.addEventListener('pointerdown', jump);
window.addEventListener('keydown', e => {
  if (e.key === ' ') jump();
  if (e.key === 'ArrowRight') accelerating = true;
});
window.addEventListener('keyup', e => {
  if (e.key === 'ArrowRight') accelerating = false;
});
btnRight.addEventListener('pointerdown', () => accelerating = true);
btnRight.addEventListener('pointerup', () => accelerating = false);
btnRight.addEventListener('pointercancel', () => accelerating = false);
btnRight.addEventListener('pointerleave', () => accelerating = false);

function submitScore(name, score) {
  return fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score })
  });
}

function loadLeaderboard() {
  fetch('/api/leaderboard')
    .then(r => r.json())
    .then(data => {
      leaderboardEl.innerHTML = '';
      data.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name} - ${entry.score}`;
        leaderboardEl.appendChild(li);
      });
    });
}
