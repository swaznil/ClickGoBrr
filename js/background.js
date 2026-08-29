export function initBackground() {
const canvas = document.getElementById("Background");
const backgroundToggle = document.getElementById("background-toggle");

if (!canvas) {
  return;
}

const context = canvas.getContext("2d");

let stars = [];
let animationFrame = 0;
let enabled = true;

function loadSetting() {
  try {
    const settings =
      JSON.parse(localStorage.getItem("clickgobrr-settings")) || {};
    enabled = settings.background ?? true;
  } catch {
    enabled = true;
  }
}

function clearCanvas() {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

function createStars(width, horizon) {
  stars = [];

  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * horizon,
      size: Math.random() > 0.8 ? 1.5 : 1,
      speed: 10 + Math.random() * 14,
    });
  }
}

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  createStars(window.innerWidth, window.innerHeight * 0.8);
}

function drawStars(width, horizon, time) {
  context.fillStyle = "#f2f4e8";

  for (const star of stars) {
    const y = (star.y + time * star.speed) % horizon;
    const twinkle = 0.35 + Math.sin(time * 2 + star.x) * 0.15;

    context.globalAlpha = twinkle;
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

  const movement = (time * 1.2) % 1;

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
  if (!enabled) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const horizon = height * 0.8;
  const time = now / 1000;

  clearCanvas();

  drawStars(width, horizon, time);
  drawSun(width, horizon);

  context.strokeStyle = "rgba(200,255,79,0.4)";
  context.beginPath();
  context.moveTo(0, horizon);
  context.lineTo(width, horizon);
  context.stroke();

  drawGrid(width, height, horizon, time);

  animationFrame = requestAnimationFrame(draw);
}

function start() {
  cancelAnimationFrame(animationFrame);

  if (!enabled) {
    clearCanvas();
    return;
  }

  animationFrame = requestAnimationFrame(draw);
}

function stop() {
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  clearCanvas();
}

function setEnabled(value) {
  enabled = value;

  if (enabled) {
    start();
  } else {
    stop();
  }
}

window.addEventListener("resize", () => {
  resize();

  if (enabled) {
    start();
  }
});

if (backgroundToggle) {
  backgroundToggle.addEventListener("change", () => {
    setEnabled(backgroundToggle.checked);
  });
}

loadSetting();

if (backgroundToggle) {
  backgroundToggle.checked = enabled;
}

resize();

if (enabled) {
  start();
} else {
  clearCanvas();
}
}
