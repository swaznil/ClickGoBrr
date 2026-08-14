const promptElement = document.getElementById("prompt");
const typingArea = document.getElementById("typing-area");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const sourceElement = document.getElementById("source");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart-button");
const nextButton = document.getElementById("next-button");

const passages = [
  {
    source: "Walden — Henry David Thoreau",
    text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach.",
  },

  {
    source: "Self-Reliance — Ralph Waldo Emerson",
    text: "Trust thyself: every heart vibrates to that iron string. Accept the place the divine providence has found for you, the society of your contemporaries, the connection of events.",
  },

  {
    source: "The Importance of Being Earnest — Oscar Wilde",
    text: "The truth is rarely pure and never simple. Modern life would be very tedious if it were either, and modern literature a complete impossibility.",
  },

  {
    source: "Civil Disobedience — Henry David Thoreau",
    text: "The progress from an absolute to a limited monarchy, from a limited monarchy to a democracy, is a progress toward a true respect for the individual.",
  },
];

const state = {
  passageIndex: 0,
  text: "",
  typed: "",
  timeLeft: 30,
  started: false,
  finished: false,
  timer: null,
};

function loadPassage() {
  const passage = passages[state.passageIndex];
  state.text = passage.text;
  sourceElement.textContent = passage.source;
  renderText();
}

function renderText() {
  promptElement.innerHTML = "";

  for (let i = 0; i < state.text.length; i++) {
    const character = document.createElement("span");
    character.textContent = state.text[i];
    character.classList.add("char");

    if (i < state.typed.length) {
      if (state.typed[i] === state.text[i]) {
        character.classList.add("correct");
      } else {
        character.classList.add("incorrect");
      }
    }

    if (i === state.typed.length && !state.finished) {
      character.classList.add("current");
    }

    promptElement.appendChild(character);
  }
}

function calculateStats() {
  if (state.typed.length === 0) {
    return {
      correct: 0,
      accuracy: 100,
      wpm: 0,
    };
  }

  let correct = 0;

  for (let i = 0; i < state.typed.length; i++) {
    if (state.typed[i] === state.text[i]) {
      correct++;
    }
  }

  const totalTyped = state.typed.length;
  const accuracy = Math.round((correct / totalTyped) * 100);
  const secondsUsed = 30 - state.timeLeft;
  let wpm = 0;

  if (secondsUsed > 0) {
    const minutes = secondsUsed / 60;

    wpm = Math.round(correct / 5 / minutes);
  }

  return {
    correct,
    accuracy,
    wpm,
  };
}

function updateStats() {
  const stats = calculateStats();
  wpmElement.textContent = stats.wpm;
  accuracyElement.textContent = stats.accuracy;
}

function startTimer() {
  state.started = true;
  statusElement.textContent = "typing...";
  state.timer = setInterval(() => {
    state.timeLeft--;
    timeElement.textContent = state.timeLeft;
    updateStats();

    if (state.timeLeft <= 0) {
      finishTest();
    }
  }, 1000);
}

function finishTest() {
  if (state.finished) {
    return;
  }

  state.finished = true;
  clearInterval(state.timer);
  state.timer = null;
  typingArea.classList.add("finished");
  statusElement.textContent = "finished — restart or choose a new text";

  updateStats();
  renderText();
}

function handleTyping(event) {
  if (state.finished) {
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    if (state.typed.length === 0) {
      return;
    }

    state.typed = state.typed.slice(0, -1);
    renderText();
    updateStats();
    return;
  }

  if (event.key.length !== 1) {
    return;
  }

  if (state.typed.length >= state.text.length) {
    return;
  }

  if (!state.started) {
    startTimer();
  }

  state.typed += event.key;
  renderText();
  updateStats();

  if (state.typed.length === state.text.length) {
    finishTest();
  }
}

function resetTest() {
  clearInterval(state.timer);

  state.typed = "";
  state.timeLeft = 30;
  state.started = false;
  state.finished = false;
  state.timer = null;

  timeElement.textContent = 30;
  wpmElement.textContent = 0;
  accuracyElement.textContent = 100;

  statusElement.textContent = "click the text and start typing";
  typingArea.classList.remove("finished");
  renderText();
  typingArea.focus();
}

function nextPassage() {
  state.passageIndex++;

  if (state.passageIndex >= passages.length) {
    state.passageIndex = 0;
  }
  loadPassage();
  resetTest();
}

typingArea.addEventListener("keydown", handleTyping);
typingArea.addEventListener("click", () => {typingArea.focus();});
restartButton.addEventListener("click", resetTest);
nextButton.addEventListener("click", nextPassage);

loadPassage();