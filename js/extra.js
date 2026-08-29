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


// initSettings
// initSettings
// initSettings

export function initSettings() {
const settingsButton = document.getElementById("settings-button");
const modal = document.getElementById("settings-modal");
const closeButton = document.getElementById("settings-close");

const musicToggle = document.getElementById("music-toggle");
const ghostToggle = document.getElementById("ghost-toggle");

const musicVolume = document.getElementById("music-volume");
const volumeLabel = document.getElementById("volume-label");

const defaults = {
  music: false,
  ghost: true,
  volume: 30,
};

let settings = {
  ...defaults,
  ...loadSettings(),
};

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem("clickgobrr-settings")) || {};
  } catch {
    return {};
  }
}

function saveSettings() {
  localStorage.setItem("clickgobrr-settings", JSON.stringify(settings));
}

function renderSettings() {
  musicToggle.checked = settings.music;
  ghostToggle.checked = settings.ghost;
  musicVolume.value = settings.volume;
  volumeLabel.textContent = `${settings.volume}%`;
}

function openSettings() {
  modal.classList.remove("hidden");
}
function closeSettings() {
  modal.classList.add("hidden");
}

settingsButton.addEventListener("click", openSettings);
closeButton.addEventListener("click", closeSettings);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeSettings();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeSettings();
  }
});

musicToggle.addEventListener("change", () => {
  settings.music = musicToggle.checked;
  saveSettings();
});

ghostToggle.addEventListener("change", () => {
  settings.ghost = ghostToggle.checked;
  saveSettings();
});

musicVolume.addEventListener("input", () => {
  settings.volume = Number(musicVolume.value);
  volumeLabel.textContent = `${settings.volume}%`;
  saveSettings();
});

renderSettings();

return {
  getSettings() {
    return settings;
  },
};
}

// initMusic
// initMusic
// initMusic

export function initMusic() {
const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const musicVolume = document.getElementById("music-volume");

if (!music || !musicToggle || !musicVolume) {
  return;
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem("clickgobrr-settings")) || {};
  } catch {
    return {};
  }
}

const settings = loadSettings();
music.volume = (settings.volume ?? 30) / 100;

async function updateMusic() {
  if (musicToggle.checked) {
    try {
      await music.play();
    } catch {
      musicToggle.checked = false;
    }
  } else {
    music.pause();
  }
}

musicToggle.addEventListener("change", updateMusic);
musicVolume.addEventListener("input", () => {
  music.volume = Number(musicVolume.value) / 100;
});
}
