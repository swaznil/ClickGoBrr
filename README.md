# ClickGoBrr

ClickGoBrr is a typing test designed with a retrowave aesthetic.

---

### Motivation

I found many online typing tests to be filled with ads, and their servers were occasionally down. I also wanted complete customisability, especially for things like the background and overall design, so I decided to build my own typing test with the style and features I prefer.

Try it here: https://clickgobrr.vercel.app/ 

---

### Screenshots

![Typing Test](assets/Screenshot01.png)

![Settings](assets/Screenshot02.png)

---

### Features

- Time and word modes
- Live WPM and accuracy
- Personal best
- Ghost race against your best run
- Multiple passages
- Keyboard shortcuts
- Focus mode
- Live Background
- Background music

Among these features the ghost race and background music are my favoriate parts and a main point for me creating this instead of using other websites that lacked this.

---

### How It Works

Each character entered is compared with the current passage, and WPM + Accuracy are calculated while the test is running. Time Mode ends after the selected duration, whereas Words Mode ends once the selected number of words has been completed.

Personal best records are stored locally, and the ghost race saves the progress of your best run and replays it during future tests.

---

### Project Structure

```text
clickgobrr/
|
|-- index.html
|-- README.md
|
|-- assets/
|   |-- Screenshot01.png
|   `-- Screenshot02.png
|
|-- css/
|   `-- style.css
|
`-- js/
    |-- app.js
    |-- background.js
    |-- extra.js
    `-- main.js

```

---

### AI Usage

AI (ChatGPT) was used to review and improve javaScript code. Along with it AI was used to cleanup html code and create the animation for background canvas.
Almost all the coding and final implementations were done by me.

---