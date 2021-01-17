const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const socket = io('https://stormy-temple-25827.herokuapp.com/');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('updatePlayers', handleUpdatePlayers);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('testEvent', handleTestEvent);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const startGameBtn = document.getElementById('startGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);
startGameBtn.addEventListener('click', startGame);


function newGame() {
  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  let payload = {'room_code':code, 'user_id' : anonUserId};
  socket.emit('joinGame',payload);
  init();
}

function startGame() {
  const code = gameCodeInput.value;
  socket.emit('startGame', code);
  init();
}

let canvas, ctx, anonUserId;
let playerNumber;
let gameActive = false;

function init() {
  anonUserId = genAnonUserId(15);
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.height = 600;
  
  canvas.width = 1200;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "red";
  ctx.lineWidth = "1.5";  
  ctx.font = 'italic 32px sans-serif';

  document.addEventListener('keydown', keydown);
  gameActive = true;
  
  
}
    
function keydown(e) {
  socket.emit('keydown', e.keyCode);
}

function paintLobby(payload) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var canvas_text = "Players:";
  var text_vert_pos = 50;
  var text_hor_pos = 150;
  ctx.strokeText(canvas_text, text_hor_pos, text_vert_pos); 
  for (player_idx in payload){
    text_vert_pos = text_vert_pos + 40;
    canvas_text = "user: "+String(player_idx);
    ctx.strokeText(canvas_text, text_hor_pos, text_vert_pos); 
  }  
  
}


function paintGame(state) {
  
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const gridwidth = state.gridwidth;
  const gridheight = state.gridheight;
  const size = canvas.width / gridwidth;
  
  var i,ii; 
  for (i = 0; i < gridwidth ; i++){
    for (ii = 0; ii < gridheight ; ii++){
      paintSquare(i, ii, size, state['clients'][playerNumber]['player_view'][i][ii]['fillId'])
    }
  }
  
}

function paintSquare(posHorz, posVert, size, fillId) {
  const snake = playerState.snake;
  var color = 'black';
  
  switch (fillId) {
    case 37: { //
      color = 'red';
    }
    case 38: { // 
      color = 'blue';
    }
    case 39: { // 
      color = 'green';
    }
    case 40: { // up
      color = 'white';
    }
  }

  ctx.fillStyle = color;
  ctx.fillRect(posHorz * size, posVert * size, size, size);
}

function handleUpdatePlayers(payload){
  paintLobby(payload);  
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert('You Win!');
  } else {
    alert('You Lose :(');
  }
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
  gameCodeInput.value = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTestEvent(message) {
  alert(message)
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}

function genAnonUserId(len) {
  var buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length,
    length = len || 32;
    
  for (var i = 0; i < length; i++) {
    buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
  }
  
  return buf.join('');
}



 
