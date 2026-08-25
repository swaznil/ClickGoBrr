export function initTypingTest() {
const promptElement = document.getElementById("prompt");
const typingArea = document.getElementById("typing-area");

const timeElement = document.getElementById("time");
const timerUnitElement = document.getElementById("timer-unit");

const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");

const sourceElement = document.getElementById("source");
const statusElement = document.getElementById("status");

const restartButton = document.getElementById("restart-button");
const nextButton = document.getElementById("next-button");

const lengthOptionsElement = document.getElementById("length-options");
const modeButtons = document.querySelectorAll(".mode-button");
const caretElement = document.getElementById("caret");

const resultElement = document.getElementById("result");
const resultWpmElement = document.getElementById("result-wpm");
const resultTimeElement = document.getElementById("result-time");
const resultAccuracyElement = document.getElementById("result-accuracy");
const resultBestElement = document.getElementById("result-best");
const resultRestartButton = document.getElementById("result-restart");

const timeOptions = [15, 30, 60];
const wordOptions = [10, 25, 50];

const passages = [
  {
    source: "The Adventures of Sherlock Holmes — Arthur Conan Doyle",
    text: "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer.",
  },
  {
    source: "The Time Machine — H. G. Wells",
    text: "The Time Traveller was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burned brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses. Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere when thought roams gracefully free of the trammels of precision.",
  },
  {
    source: "Frankenstein — Mary Shelley",
    text: "It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open.",
  },
  {
    source: "Twilight Clouds on Mars — NASA-inspired",
    text: "Imagine standing on Mars just after sunset and looking up to find clouds glowing red and green against the fading sky. Curiosity has observed these twilight clouds several times from Gale Crater. Some contain frozen carbon dioxide, better known as dry ice, rather than only water ice. Scientists can study the way sunlight scatters through them to estimate the size and growth of their particles. Stranger still, the phenomenon appears predictably during a particular season, yet similar carbon dioxide clouds have not been observed everywhere on Mars. A beautiful sunset can therefore become a useful scientific puzzle about the structure and behavior of an alien atmosphere.",
  },
  {
    source: "A Very Strange Object in Space — NASA-inspired",
    text: "Astronomers occasionally discover something that refuses to fit neatly into the categories they already understand. One such object, ASKAP J1832-0911, produces repeating changes in radio waves over periods of tens of minutes. Observations with the Chandra X-ray Observatory revealed something even stranger: its X-rays also vary on a cycle of about forty-four minutes. Researchers have proposed several possible explanations, but the object's behavior remains unusual. Discoveries like this are useful precisely because they are confusing. An observation that breaks an existing explanation can force scientists to reconsider assumptions, gather new evidence and sometimes discover an entirely new class of objects.",
  },
  {
    source: "The Moon's Frozen Shadows — NASA-inspired",
    text: "Near the Moon's south pole, sunlight and darkness create an environment unlike almost anywhere on Earth. Some high ridges can remain illuminated for long periods while the floors of nearby craters sit in permanent shadow. These dark regions become extraordinarily cold and can preserve deposits of water ice. That ice is scientifically interesting because it may contain clues about the Moon's history, but it could also matter to future explorers. Water can be used directly, while its hydrogen and oxygen can potentially support life or become ingredients for rocket propellant. A frozen crater on the Moon may therefore be both an archive of the past and a resource for future exploration.",
  },
  {
    source: "Borrowing Ideas From Nature — Smithsonian-inspired",
    text: "Some inventions begin not with a machine but with an animal, plant or microscopic structure. Biomimicry is the practice of studying solutions that evolved in nature and adapting their principles to human problems. Researchers might examine how an insect folds its wings, how an animal resists a toxin or how a biological structure repairs itself. The goal is not necessarily to copy nature exactly. Instead, scientists look for mechanisms that reveal a useful engineering idea. Nature has spent billions of years producing strange solutions to problems involving movement, strength, survival and efficiency, which makes the living world an enormous library of designs waiting to be understood.",
  },
];

const state = {
  passageIndex: 0,
  mode: "time",
  option: 30,
  text: "",
  typed: "",
  timeLeft: 30,
  started: false,
  finished: false,
  startTime: null,
  elapsed: 0,
  timer: null,
};

function loadPassage() {
  const passage = passages[state.passageIndex];
  if (state.mode === "time") {
    let text = passage.text;
    let index = state.passageIndex + 1;

    while (text.length < 1500) {
      if (index >= passages.length) {
        index = 0;
      }
      text += ` ${passages[index].text}`;
      index++;
    }
    state.text = text;
    sourceElement.textContent = passage.source;
  } else {
    const words = [];
    let index = state.passageIndex;

    while (words.length < state.option) {
      const currentPassage = passages[index];
      words.push(...currentPassage.text.split(/\s+/));
      index++;

      if (index >= passages.length) {
        index = 0;
      }
    }
    state.text = words.slice(0, state.option).join(" ");

    if (state.option <= passage.text.split(/\s+/).length) {
      sourceElement.textContent = passage.source;
    } else {
      sourceElement.textContent = "Mixed passages";
    }
  }

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
  requestAnimationFrame(positionText);
}

function positionText() {
  const current =
    promptElement.querySelector(".current") || promptElement.lastElementChild;

  if (!current) {
    return;
  }
  const lineHeight = parseFloat(getComputedStyle(promptElement).lineHeight);
  const row = Math.round(current.offsetTop / lineHeight);
  const visibleRow = row < 2 ? 0 : row - 1;
  const shift = visibleRow * lineHeight;
  promptElement.style.transform = `translateY(${-shift}px)`;

  const x = current.offsetLeft;
  const y = current.offsetTop - shift;
  caretElement.style.transform = `translate(${x}px, ${y}px)`;
}

function renderOptions() {
  lengthOptionsElement.innerHTML = "";

  const options = state.mode === "time" ? timeOptions : wordOptions;

  for (const option of options) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = option;

    if (option === state.option) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      state.option = option;

      renderOptions();
      loadPassage();
      resetTest();
    });

    lengthOptionsElement.appendChild(button);
  }
}

function getElapsedTime() {
  if (!state.started || state.startTime === null) {
    return 0;
  }
  if (state.finished) {
    return state.elapsed;
  }
  return (Date.now() - state.startTime) / 1000;
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
  const secondsUsed = getElapsedTime();

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

function updateWordsRemaining() {
  if (state.mode !== "words") {
    return;
  }

  let completedWords = 0;

  if (state.typed.length > 0) {
    completedWords = (state.typed.match(/ /g) || []).length;
  }

  if (state.typed.length === state.text.length) {
    completedWords = state.option;
  }

  const remaining = Math.max(0, state.option - completedWords);

  timeElement.textContent = remaining;
}

function getBestKey() {
  return `clickgobrr-best-${state.mode}-${state.option}`;
}

function getPersonalBest() {
  return Number(localStorage.getItem(getBestKey())) || 0;
}

function savePersonalBest(wpm) {
  const currentBest = getPersonalBest();

  if (wpm > currentBest) {
    localStorage.setItem(getBestKey(), wpm);
    return wpm;
  }
  return currentBest;
}

function startTest() {
  state.started = true;
  state.startTime = Date.now();
  typingArea.classList.add("typing");
  statusElement.textContent = "typing...";

  if (state.mode === "time") {
    state.timer = setInterval(() => {
      state.timeLeft--;
      timeElement.textContent = state.timeLeft;
      updateStats();

      if (state.timeLeft <= 0) {
        finishTest();
      }
    }, 1000);
  }
}

function finishTest() {
  if (state.finished) {
    return;
  }

  state.elapsed =
    state.startTime === null ? 0 : (Date.now() - state.startTime) / 1000;
  state.finished = true;
  clearInterval(state.timer);
  state.timer = null;
  typingArea.classList.remove("typing");
  typingArea.classList.add("finished");
  if (state.mode === "words") {
    timeElement.textContent = 0;
  }

  const stats = calculateStats();
  const best = savePersonalBest(stats.wpm);

  resultWpmElement.textContent = stats.wpm;
  resultAccuracyElement.textContent = `${stats.accuracy}%`;
  resultTimeElement.textContent = `${state.elapsed.toFixed(1)}s`;
  resultBestElement.textContent = best;
  resultElement.hidden = false;
  statusElement.textContent = "finished";

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
    updateWordsRemaining();
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
    startTest();
  }

  state.typed += event.key;
  updateWordsRemaining();
  renderText();
  updateStats();

  if (state.mode === "words" && state.typed.length === state.text.length) {
    finishTest();
  }
}

function resetTest() {
  clearInterval(state.timer);

  state.typed = "";
  state.timeLeft = state.mode === "time" ? state.option : 0;
  state.started = false;
  state.finished = false;
  state.startTime = null;
  state.elapsed = 0;
  state.timer = null;

  typingArea.classList.remove("typing");
  typingArea.classList.remove("finished");
  promptElement.style.transform = "translateY(0)";
  resultElement.hidden = true;

  timeElement.textContent = state.option;
  timerUnitElement.textContent = state.mode === "time" ? "seconds" : "words";

  wpmElement.textContent = 0;
  accuracyElement.textContent = 100;

  statusElement.textContent = "click the text and start typing";
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

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    state.option = state.mode === "time" ? 30 : 25;

    modeButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderOptions();
    loadPassage();
    resetTest();
  });
});

typingArea.addEventListener("keydown", handleTyping);
typingArea.addEventListener("click", () => {
  typingArea.focus();
});
restartButton.addEventListener("click", resetTest);
nextButton.addEventListener("click", nextPassage);
resultRestartButton.addEventListener("click", resetTest);
window.addEventListener("resize", positionText);

renderOptions();
loadPassage();
resetTest();
}
