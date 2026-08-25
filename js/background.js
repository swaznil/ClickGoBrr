export function initBackground() {
const canvas = document.getElementById("Background");

if (!canvas) {
  return;
}

const context = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let stars = [];
let animationFrame = 0;

function createStars(width, horizon) {
  stars = [];

  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * horizon,
      size: Math.random() > 0.8 ? 1.5 : 1,
      speed: 0.15 + Math.random() * 0.35,
    });
  }
}

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerWidth * ratio);

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerWidth}px`;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  createStars(window.innerWidth, window.innerHeight);
}

function drawStars(width, horizon, time) {
  context.fillStyle = "#f9faf4";

  for (const star of stars) {
    const y = reducedMotion.matches
      ? star.y
      : (star.y + time * star.speed) % horizon;

    context.globalAlpha = 0.45;

    context.fillRect(star.x, y, star.size, star.size);
  }

  context.globalAlpha = 1;
}

function drawSun(width, horizon) {
  const x = width / 2;
  const radius = Math.min(90, width * 0.09);
  const y = horizon + radius * 0.1;

  context.save();

  context.fillStyle = "#fe52a0";
  context.globalAlpha = 0.4;

  for (let offset = -radius; offset <= radius; offset += 9) {
    const halfWidth = Math.sqrt(
      Math.max(0, radius * radius - offset * offset),
    );

    context.fillRect(x - halfWidth, y + offset, halfWidth * 2, 5);
  }

  context.restore();
}

function drawGrid(width, height, horizon, time) {
  const center = width / 2;

  context.strokeStyle = "rgba(200,255,79,0.22)";
  context.lineWidth = 1;

  for (let i = -16; i <= 16; i++) {
    const bottomX = center + (i * width) / 12;

    context.beginPath();
    context.moveTo(center, horizon);
    context.lineTo(bottomX, height);
    context.stroke();
  }

  const movement = reducedMotion.matches ? 0 : (time * 0.55) % 1;

  for (let i = 0; i < 14; i++) {
    const progress = (i + movement) / 13;

    if (progress > 1) {
      continue;
    }

    const y = horizon + (height - horizon) * progress * progress;

    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function draw(now = performance.now()) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const horizon = height * 0.8;
  const time = now / 1000;

  context.clearRect(0, 0, width, height);

  drawStars(width, horizon, time);
  drawSun(width, horizon);

  context.strokeStyle = "rgba(200,255,79,0.4)";
  context.beginPath();
  context.moveTo(0, horizon);
  context.lineTo(width, horizon);
  context.stroke();

  drawGrid(width, height, horizon, time);

  if (!reducedMotion.matches) {
    animationFrame = requestAnimationFrame(draw);
  }
}

function start() {
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(draw);
}

function stop() {
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
}

window.addEventListener("resize", () => {
  resize();
  stop();
  draw();

  if (!reducedMotion.matches) {
    start();
  }
});

reducedMotion.addEventListener("change", () => {
  stop();
  draw();

  if (!reducedMotion.matches) {
    start();
  }
});

resize();
draw();

if (!reducedMotion.matches) {
  start();
}
}
