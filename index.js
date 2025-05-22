// List of words for the typing test
let wpmWords = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "hello", "world",
  "this", "is", "a", "test", "typing", "speed", "keyboard", "practice", "code", "skill",
  "learn", "improve", "focus", "game", "score", "timer", "word", "minute", "fast", "slow",
  "track", "repeat", "build", "habit", "daily", "train", "finger", "motion", "pattern",
  "flow", "line", "press", "backspace", "correct", "error", "check", "text", "record",
  "count", "goal", "simple", "hard", "easy", "quickly", "again", "perfect", "smooth",
  "ready", "begin", "start", "stop", "pause", "resume", "restart", "scoreboard",
  "challenge", "level", "type", "shift", "space", "enter", "letter", "symbol", "form",
  "page", "set", "try", "run", "done", "result", "chart", "graph", "stats", "hit", "miss",
  "time", "second", "hour", "day", "week", "month", "year", "data", "average", "top",
  "best", "rank", "sharp", "clean", "fastest", "strong", "steady", "rise", "fall", "reach",
  "pass", "fail", "great", "good", "better", "master", "grow", "win", "fight", "plan",
  "prepare", "stay", "think", "tap", "push", "move", "click", "scroll", "input", "device",
  "monitor", "display", "field", "entry", "layout", "design", "button", "icon", "drag",
  "drop", "highlight", "select", "copy", "paste", "cut", "undo", "redo", "save", "load",
  "reset", "edit", "view", "zoom", "open", "close", "tab", "window", "screen", "bar",
  "menu", "file", "folder", "hover", "wait", "hold", "output", "script", "loop", "bug",
  "fix", "deploy", "compile", "syntax", "logic", "debug", "update", "upgrade", "launch",
  "task", "job", "project", "finish", "title", "aim", "target", "value", "rate", "high",
  "low", "mid"
];

// Number of words per row
const STEP = 16;

// Shuffle the words array for randomness
for (let i = wpmWords.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1));
    const temp = wpmWords[i];
    wpmWords[i] = wpmWords[j];
    wpmWords[j] = temp;
}

// Get the finish modal and set up event to reset on close
const finishModal = document.getElementById('finishModal');
finishModal.addEventListener('hidden.bs.modal', function () {
    reset();
});

// Render words into two rows, cycling if needed
function setWords(start, step){
    let i = start;
    const div1 = document.getElementById('div1');
    const div2 = document.getElementById('div2');
    div1.innerHTML = "";
    div2.innerHTML = "";
    // First row
    for(let count = 0; count < step; count++, i++) {
        let idx = i % wpmWords.length;
        const span = document.createElement('span');
        span.setAttribute("class", "word");
        for(let j = 0; j < wpmWords[idx].length; j++) {
            const letter = document.createElement('span');
            letter.setAttribute("class", "letter");
            letter.textContent = wpmWords[idx][j];
            span.appendChild(letter);
        }
        div1.appendChild(span);
    }
    // Second row
    for(let count = 0; count < step; count++, i++) {
        let idx = i % wpmWords.length;
        const span = document.createElement('span');
        span.setAttribute("class", "word");
        for(let j = 0; j < wpmWords[idx].length; j++) {
            const letter = document.createElement('span');
            letter.setAttribute("class", "letter");
            letter.textContent = wpmWords[idx][j];
            span.appendChild(letter);
        }
        div2.appendChild(span);
    }
    // Highlight the first word and letter as active
    const firstWord = document.querySelector(".word");
    const firstLetter = document.querySelector(".letter");
    firstWord.classList.add('active');
    firstLetter.classList.add('active');
    div1.setAttribute("start", start % wpmWords.length);
}

// Initialize the first set of words
setWords(0, STEP);

// Typing test state variables
let timerStarted = false;
let seconds = 1;
let totalTime = 60;
let totalCharacters = 0;
let correctCharacters = 0;
let incorrectCharacters = 0;
let timerInterval;

// Handles typing input and timer logic
function typingStart(event) {
    const input = document.getElementById('input');
    const text = input.value;
    const activeSpan = document.querySelector(".word.active");
    const nextSpan = activeSpan.nextElementSibling;
    const activeLetter = activeSpan.querySelector(".letter.active");

    // Start timer on first key press
    if(!timerStarted) {
        timerStarted = true;
        const timer = document.getElementById('timer');
        timer.textContent = seconds;
        timerInterval = setInterval(() => {
            seconds++;
            timer.textContent = seconds;
            // When time is up, show modal and stop timer
            if(seconds == totalTime) {
                input.disabled = true;
                const finishModal = new bootstrap.Modal(document.getElementById('finishModal'));
                const wpmSpan = document.getElementById('wpm');
                const accuracySpan = document.getElementById('accuracy');
                wpmSpan.textContent = Math.floor(((totalCharacters/5)-incorrectCharacters ) / (totalTime / 60));
                accuracySpan.textContent = totalCharacters > 0 ? ((correctCharacters/totalCharacters) * 100).toFixed(2) + "%" : "0%";
                console.log("Total Characters: " + totalCharacters);
                console.log("Correct Characters: " + correctCharacters);
                console.log("Incorrect Characters: " + incorrectCharacters);
                finishModal.show();
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    // When space is pressed, check the word and move to next
    if (event.key === " ") {
        event.preventDefault(); // Prevent space from being added to input
        const wordText = activeSpan.textContent;
        const typedText = text.trim();
        if (wordText === typedText) {
            activeSpan.classList.add('correct');
        }
        else {
            activeSpan.classList.add('incorrect');
            if (typedText.length < wordText.length) {
                incorrectCharacters += wordText.length - typedText.length;
            }
        }
        if(nextSpan === null) {
            const div1 = document.getElementById('div1');
            let start = parseInt(div1.getAttribute("start"));
            setWords(start + STEP, STEP);
            input.value = "";
            return;
        }
        activeSpan.classList.remove('active');
        nextSpan.classList.add('active');
        nextSpan.querySelector(".letter").classList.add('active');
        const LastLetter = document.querySelector(".LastLetter");
        if(LastLetter)LastLetter.classList.remove('LastLetter');
        input.value = "";
    }

    // If backspace is pressed, remove the last letter
    else if (event.key === "Backspace") {
        if(!activeLetter) { // Acitve letter is next to last letter, now we need to activate the last letter
            const LastLetter = document.querySelector(".LastLetter");
            LastLetter.classList.add('active');
            if(LastLetter.classList.contains('correct')) {
                correctCharacters--;
                LastLetter.classList.remove('correct');
            }
            else {
                LastLetter.classList.remove('incorrect');
                incorrectCharacters--;
            }
            LastLetter.classList.remove('LastLetter');
        }
        else if(activeLetter.previousElementSibling) { // Move to the previous letter
            activeLetter.classList.remove('active');
            activeLetter.previousElementSibling.classList.add('active');
            if(activeLetter.previousElementSibling.classList.contains('correct')) {
                correctCharacters--;
                activeLetter.previousElementSibling.classList.remove('correct');
            }
            else {
                activeLetter.previousElementSibling.classList.remove('incorrect');
                incorrectCharacters--;
            }
        } 
    }

    // Only process character keys (ignore Shift, Ctrl, etc.)
    else if (event.key.length === 1 && activeLetter != null) {
        totalCharacters++;
        if(event.key === activeLetter.textContent){
            activeLetter.classList.add('correct');
            correctCharacters++;
        } else {
            activeLetter.classList.add('incorrect');
            incorrectCharacters++;
        }
        // Move to the next letter
        if (activeLetter.nextElementSibling) {
            activeLetter.classList.remove('active');
            activeLetter.nextElementSibling.classList.add('active');
        }
        else {
            activeLetter.classList.remove('active');
            activeLetter.classList.add('LastLetter');
        }
    }
};

// Resets the typing test to initial state
function reset() {
    // Shuffle words again
    for (let i = wpmWords.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1));
        const temp = wpmWords[i];
        wpmWords[i] = wpmWords[j];
        wpmWords[j] = temp;
    }
    const input = document.getElementById('input');
    input.value = "";
    const div1 = document.getElementById('div1');
    div1.setAttribute("start", 0);
    setWords(0, STEP);
    const timer = document.getElementById('timer');
    timer.textContent = "0";
    timerStarted = false;
    input.disabled = false;
    seconds = 1;
    clearInterval(timerInterval);
    totalCharacters = 0;
    correctCharacters = 0;
    incorrectCharacters = 0;
}

// Sets the total time for the test and updates the display
function setTimer(time) {
    const totalTimeSpan = document.getElementById('totalTime');
    totalTimeSpan.textContent = time + "s";
    totalTime = time;
}