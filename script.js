let todayData = null;
let attempts = 0;

async function loadToday() {
  const res = await fetch("/api/today");
  todayData = await res.json();
  setupBoard(todayData.attributes.length, todayData.maxAttempts);
}

function setupBoard(length, rows) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let c = 0; c < length; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
  attempts = 0;
}

async function submitGuess() {
  const input = document.getElementById("guessInput");
  const guess = input.value.trim();
  if (!guess) return;

  const res = await fetch("/api/validate", {
    method: "POST",
    body: JSON.stringify({ guess, date: todayData.date })
  });
  const result = await res.json();
  showFeedback(guess, result.feedback);

  attempts++;
  if (result.correct) {
    showMsg("Correct! You guessed " + guess);
  } else if (attempts >= todayData.maxAttempts) {
    showMsg("Out of tries! The answer was " + todayData.character.name);
  } else if(result.msg){
    showMsg(result.msg);
  } else {
    showMsg(`Attempts: ${attempts}/${todayData.maxAttempts}`);
  }

  input.value = "";
}

function showFeedback(guess, fb) {
  const row = document.getElementById("board").children[attempts];
  const tiles = row.children;
  for (let i = 0; i < fb.length; i++) {
    tiles[i].textContent = todayData.character[todayData.attributes[i]].toString().toUpperCase();
    tiles[i].classList.add(fb[i]);
    tiles[i].classList.add("flip");
    setTimeout(() => tiles[i].classList.remove("flip"), 600);
  }
}

function showMsg(t) { document.getElementById("msg").textContent = t; }
document.getElementById("guessBtn").onclick = submitGuess;
loadToday();