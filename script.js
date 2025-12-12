// Client-side game logic for Classic mode with multi-value comparison
let characters = [];
let todayData = null;
let attempts = 0;

const ATTRS = ["name","gender","birthplace","lastName","class","roles","appearsIn"];

async function loadCharactersAndToday(){
  // load full character list for datalist and validation
  const res = await fetch("/data/characters.json");
  characters = await res.json();

  // populate datalist for autocomplete
  const dl = document.getElementById("charactersList");
  dl.innerHTML = "";
  characters.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    dl.appendChild(opt);
  });

  // fetch today's metadata (date, maxAttempts, attributes)
  const t = await fetch("/api/today");
  todayData = await t.json();

  setupBoard(ATTRS.length, todayData.maxAttempts);
}

function setupBoard(cols, rows){
  const board = document.getElementById("board");
  board.innerHTML = "";
  for(let r=0;r<rows;r++){
    const row = document.createElement("div");
    row.className = "row";
    for(let c=0;c<cols;c++){
      const tile = document.createElement("div");
      tile.className = "tile small";
      tile.textContent = "";
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
  attempts = 0;
  showMsg('');
}

function showMsg(txt){
  document.getElementById('msg').textContent = txt;
}

function formatValue(val){
  if(Array.isArray(val)) return val.join(", ");
  return String(val);
}

async function submitGuess(){
  const input = document.getElementById('guessInput');
  const guess = input.value.trim();
  if(!guess) return;

  // find guessed character in local list
  const guessed = characters.find(c => c.name.toLowerCase() === guess.toLowerCase());
  if(!guessed){
    const rowEl = document.getElementById('board').children[attempts];
    rowEl.classList.add('shake');
    setTimeout(()=>rowEl.classList.remove('shake'),460);
    showMsg('Unknown character — please select from the list.');
    return;
  }

  // call server to validate (server selects today's answer by date)
  const res = await fetch('/api/validate', {
    method:'POST',
    body: JSON.stringify({ guess: guessed.name, date: todayData.date })
  });
  const data = await res.json();
  // data.feedback is an array of colors for ATTRS
  revealRow(guessed, data.feedback);

  attempts++;

  if(data.correct){
    showMsg('Correct — you guessed the character!');
    disableInput(true);
  } else if(attempts >= todayData.maxAttempts){
    showMsg('Out of tries — the answer was: ' + data.character.name);
    // reveal answer as final row maybe
    disableInput(true);
  } else {
    showMsg(`Attempts: ${attempts}/${todayData.maxAttempts}`);
  }

  input.value = '';
}

function disableInput(val){
  document.getElementById('guessInput').disabled = val;
  document.getElementById('guessBtn').disabled = val;
}

function revealRow(guessed, feedback){
  const row = document.getElementById('board').children[attempts];
  for(let i=0;i<ATTRS.length;i++){
    const tile = row.children[i];
    const key = ATTRS[i];
    const display = formatValue(guessed[key]);
    tile.textContent = display;
    // add pop then flip sequence
    tile.classList.add('pop');
    setTimeout(()=> tile.classList.remove('pop'), 180);
    setTimeout(()=>{
      tile.classList.add('flip');
      // apply color class
      tile.classList.remove('green','yellow','gray');
      tile.classList.add(feedback[i]);
      setTimeout(()=> tile.classList.remove('flip'), 600);
    }, i * 240);
  }
}

function resetGame(){
  // simply reload board and re-enable input
  setupBoard(ATTRS.length, todayData.maxAttempts);
  disableInput(false);
  showMsg('');
  document.getElementById('guessInput').value='';
  attempts = 0;
}

// attach events
document.getElementById('guessBtn').addEventListener('click', submitGuess);
document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('guessInput').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') submitGuess();
});

// start
loadCharactersAndToday();