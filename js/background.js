export function initBackground() {

const canvas = document.getElementById("Background");

if (!canvas) {
  return;
}

const context = canvas.getContext("2d");
let stars = [];
let animationFrame = 0;

function createStars(width, height) {
  stars = [];

  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
    });
  }
}

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  createStars(window.innerWidth, window.innerHeight);
}

function draw() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  context.clearRect(0, 0, width, height);

  for (const star of stars) {
    star.y += star.speed;

    if (star.y > height * 0.8) {
      star.y = 0;
      star.x = Math.random() * width;
    }

    context.globalAlpha = 0.5;
    context.fillStyle = "#f3f3f3";
    context.fillRect(star.x, star.y, star.size, star.size);
  }

  context.globalAlpha = 1;
  animationFrame = requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);

resize();
draw();

}
