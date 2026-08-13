const promptElement = document.getElementById("prompt");
const typingArea = document.getElementById("typing-area");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const restartButton = document.getElementById("restart-button");

const text = "A quick brown fox jumps over the lazy dog.";

let currentIndex = 0;
let correctCharacters = 0;
let totalTyped = 0;
let timeLeft = 30;
let timer = null;
let started = false;


function loadText() {
  promptElement.innerHTML = "";

  text.split("").forEach((character, index) => {
    const span = document.createElement("span");

    span.textContent = character;
    span.classList.add("char");

    if (index === 0) {
      span.classList.add("current");
    }

    promptElement.appendChild(span);
  });
}


function startTimer() {
  started = true;

  timer = setInterval(() => {
    timeLeft--;
    timeElement.textContent = timeLeft;

    updateStats();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
}


function updateStats() {
  const timeUsed = 30 - timeLeft;

  if (timeUsed > 0) {
    const minutes = timeUsed / 60;

    const wpm = Math.round(
      (correctCharacters / 5) / minutes
    );

    wpmElement.textContent = wpm;
  }


  if (totalTyped > 0) {
    const accuracy = Math.round(
      (correctCharacters / totalTyped) * 100
    );

    accuracyElement.textContent = accuracy;
  }
}


function handleTyping(event) {
  if (timeLeft <= 0) {
    return;
  }


  if (event.key === "Backspace") {
    if (currentIndex === 0) {
      return;
    }

    currentIndex--;
    const characters = promptElement.querySelectorAll(".char");
    characters[currentIndex].classList.remove(
      "correct",
      "incorrect",
      "current"
    );
    characters[currentIndex].classList.add("current");

    return;
  }


  if (event.key.length !== 1) {
    return;
  }


  if (currentIndex >= text.length) {
    return;
  }


  if (!started) {
    startTimer();
  }


  const characters = promptElement.querySelectorAll(".char");
  const currentCharacter = characters[currentIndex];
  const expectedCharacter = text[currentIndex];

  totalTyped++;


  if (event.key === expectedCharacter) {
    currentCharacter.classList.add("correct");

    correctCharacters++;
  } else {
    currentCharacter.classList.add("incorrect");
  }

  currentCharacter.classList.remove("current");
  currentIndex++;


  if (currentIndex < characters.length) {
    characters[currentIndex].classList.add("current");
  }


  updateStats();
}


function restartTest() {
  clearInterval(timer);

  currentIndex = 0;
  correctCharacters = 0;
  totalTyped = 0;
  timeLeft = 30;
  timer = null;
  started = false;


  timeElement.textContent = 30;
  wpmElement.textContent = 0;
  accuracyElement.textContent = 100;

  loadText();
  typingArea.focus();
}


typingArea.addEventListener("keydown", handleTyping);
typingArea.addEventListener("click", () => {
  typingArea.focus();
});

restartButton.addEventListener("click", restartTest);

loadText();