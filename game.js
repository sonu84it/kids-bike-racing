'use strict';
// Simple pixel-style racing game
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const hudTime = document.getElementById('time');
const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panelTitle');
const final = document.getElementById('final');
const playBtn = document.getElementById('play');
const startPanel = document.getElementById('start-panel');
const startBtn = document.getElementById('start');
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnUp = document.getElementById('btnUp');
const btnDown = document.getElementById('btnDown');

let running = false;
let last = 0;
let dist = 0;      // player distance along track
let speed = 2;      // player speed
let lane = 280;     // player x position
const finish = 5000;
let time = 0;
let aiPlayers = [];

function init() {
  panel.hidden = true;
  startPanel.hidden = false;
  draw();
}

function reset() {
  running = true;
  dist = 0;
  speed = 2;
  lane = 280;
  time = 0;
  last = performance.now();
  aiPlayers = [
    {dist:0, lane:220, speed:2.3},
    {dist:0, lane:340, speed:1.9}
  ];
  panel.hidden = true;
  startPanel.hidden = true;
  requestAnimationFrame(loop);
}

function endGame(win) {
  running = false;
  panelTitle.textContent = win ? 'You Win!' : 'Game Over';
  final.textContent = `Time: ${time.toFixed(1)}s`;
  panel.hidden = false;
}

function update(dt) {
  dist += speed * 100 * dt;
  aiPlayers.forEach(p => p.dist += p.speed * 100 * dt);

  // collision detection
  for (const p of aiPlayers) {
    if (Math.abs(p.dist - dist) < 40 && Math.abs(p.lane - lane) < 20) {
      endGame(false);
      return;
    }
  }

  if (dist > finish) endGame(true);
}

function draw() {
  ctx.clearRect(0,0,600,400);
  // background
  ctx.fillStyle = '#9be8f9';
  ctx.fillRect(0,0,600,250);
  ctx.fillStyle = '#8fd400';
  ctx.fillRect(0,250,600,50);
  ctx.fillStyle = '#7c543e';
  ctx.fillRect(0,300,600,100);
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([20,20]);
  ctx.beginPath();
  ctx.moveTo(100,330);
  ctx.lineTo(500,330);
  ctx.stroke();
  ctx.setLineDash([]);

  // finish line
  if (finish - dist < 300) {
    const y = 300 - (finish - dist);
    ctx.fillStyle = '#fff';
    ctx.fillRect(100, y, 400, 5);
  }

  // draw opponents
  aiPlayers.forEach(p => {
    const y = 300 - (p.dist - dist);
    if (y > 260 && y < 420) {
      ctx.fillStyle = '#ff5722';
      ctx.fillRect(p.lane - 10, y - 20, 20, 20);
    }
  });

  // player
  ctx.fillStyle = '#2196f3';
  ctx.fillRect(lane - 10, 300 - 20, 20, 20);

  // HUD
  hudTime.textContent = `Time: ${time.toFixed(1)}s`;
}

function loop(t) {
  if (!running) return;
  const dt = (t - last) / 1000;
  last = t;
  if (document.hidden) { requestAnimationFrame(loop); return; }
  time += dt;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function moveLeft() { lane = Math.max(120, lane - 20); }
function moveRight() { lane = Math.min(480, lane + 20); }
function speedUp() { speed = Math.min(5, speed + 0.5); }
function slowDown() { speed = Math.max(1, speed - 0.5); }

btnLeft?.addEventListener('pointerdown', moveLeft);
btnRight?.addEventListener('pointerdown', moveRight);
btnUp?.addEventListener('pointerdown', speedUp);
btnDown?.addEventListener('pointerdown', slowDown);

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
  if (e.key === 'ArrowUp') speedUp();
  if (e.key === 'ArrowDown') slowDown();
});

playBtn.onclick = reset;
startBtn.onclick = reset;
window.onload = init;
