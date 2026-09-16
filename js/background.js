export function initBackground() {
const canvas = document.getElementById("Background");
const toggle = document.getElementById("background-toggle");
if (!canvas) return;

const ctx = canvas.getContext("2d");
let stars = [];

const settings = JSON.parse(
  localStorage.getItem("clickgobrr-settings") || "{}",
);

let enabled = settings.background ?? true;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  stars = [];

  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.8,
    });
  }

  draw();
}

function draw() {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  if (!enabled) return;

  const horizon = h * 0.8;

  ctx.fillStyle = "#e8eadb";

  for (const star of stars) {
    ctx.fillRect(star.x, star.y, 1.5, 1.5);
  }

  ctx.fillStyle = "rgba(249, 88, 160, 0.45)";

  for (let y = -100; y < 100; y += 10) {
    const width = Math.sqrt(100 * 100 - y * y);
    ctx.fillRect(w / 2 - width, horizon + y, width * 2, 5);
  }
}

window.addEventListener("resize", resize);

if (toggle) {
  toggle.checked = enabled;

  toggle.addEventListener("change", () => {
    enabled = toggle.checked;
    draw();
  });
}

resize();
}
