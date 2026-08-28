export function createGhostRace({
  promptElement,
  ghostElement,
  getElapsedTime,
  getKey,
}) {
let savedRun = null;
let currentRun = [];
let ghostIndex = 0;
let animationFrame = 0;
let scrollShift = 0;

function load() {
  try {
    savedRun = JSON.parse(localStorage.getItem(getKey())) || null;
  } catch {
    savedRun = null;
  }

  ghostElement.classList.toggle(
    "hidden",
    !savedRun || !savedRun.times?.length,
  );
}

function save(wpm, elapsed) {
  if (currentRun.length === 0) {
    return;
  }

  const shouldSave =
    !savedRun ||
    wpm > savedRun.wpm ||
    (wpm === savedRun.wpm && elapsed < savedRun.elapsed);

  if (!shouldSave) {
    return;
  }

  savedRun = {
    wpm,
    elapsed,
    times: [...currentRun],
  };

  localStorage.setItem(getKey(), JSON.stringify(savedRun));
}

function record(characterCount) {
  const index = characterCount - 1;

  if (index < 0) {
    return;
  }

  currentRun[index] = getElapsedTime();
  currentRun.length = characterCount;
}

function position() {
  if (!savedRun?.times?.length) {
    return;
  }

  const characters = promptElement.children;

  if (characters.length === 0) {
    return;
  }

  const index = Math.min(ghostIndex, characters.length - 1);

  const character = characters[index];

  const x = character.offsetLeft;
  const y = character.offsetTop - scrollShift;

  ghostElement.style.transform = `translate(${x}px, ${y}px)`;
}

function update() {
  if (!savedRun?.times?.length) {
    return;
  }

  const elapsed = getElapsedTime();

  while (
    ghostIndex < savedRun.times.length &&
    savedRun.times[ghostIndex] <= elapsed
  ) {
    ghostIndex++;
  }

  position();

  animationFrame = requestAnimationFrame(update);
}

function start() {
  cancelAnimationFrame(animationFrame);

  ghostIndex = 0;

  if (!savedRun?.times?.length) {
    return;
  }

  ghostElement.classList.remove("hidden");

  position();

  animationFrame = requestAnimationFrame(update);
}

function stop(wpm, elapsed) {
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;

  save(wpm, elapsed);
}

function reset() {
  cancelAnimationFrame(animationFrame);

  animationFrame = 0;
  ghostIndex = 0;
  currentRun = [];

  load();

  requestAnimationFrame(position);
}

function rewind(characterCount) {
  currentRun.length = Math.max(0, characterCount);
}

function setScrollShift(shift) {
  scrollShift = shift;
  position();
}

load();

return {
  start,
  stop,
  reset,
  record,
  rewind,
  setScrollShift,
};
}
