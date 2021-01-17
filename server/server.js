const io = require('socket.io')();
const { initGame, gameLoop, updateActionQueued } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utils');

const state = {};
const clientRooms = {};

io.on('connection', client => {

  client.on('keydown', handleKeydown);
  client.on('newGame', handleNewGame);
  client.on('startGame', handleStartGame);
  client.on('joinGame', handleJoinGame);

  function handleJoinGame(payload) {
    const roomName = payload['room_code'];
    const user_id = payload['user_id'];
    const room = io.sockets.adapter.rooms[roomName];
    
    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }
    
    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }
    
    if (numClients === 0) {
      client.emit('unknownCode');
      return;
    } else if (numClients > 10) {
      client.emit('tooManyPlayers');
      return;
    }
    
    clientRooms[client.id] = roomName;
    
    client.join(roomName);
    
    //io.sockets.in(roomName).emit('testEvent', "message : 1");
    
    client.emit('init', numClients);
    client.emit('gameCode',roomName);
    io.sockets.in(roomName).emit('updatePlayers', Object.keys(allUsers));
    
    //startGameInterval(roomName);
  }
  
  function handleStartGame(payload) {
    const roomName = payload['room_code'];
    io.sockets.emit('testEvent','message : 2');
    const room = io.sockets.adapter.rooms[roomName];
    let allUsers = false;
    let numClients = 0;
    
    if (room) {
      allUsers = room.sockets;
    }
    
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
      state[roomName] = initGame(numClients);
      startGameInterval(roomName);
    }

  }
  
  function handleNewGame() {
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);
        
    client.join(roomName);
    client.number = 1;
    client.emit('init', 1);
  }
  
  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }
    try {
      keyCode = parseInt(keyCode);
    } catch(e) {
      console.error(e);
      return;
    }
    /*
    const action = updateActionQueued(keyCode,state[roomName].players[client.number - 1].action);
    if (action) {
      state[roomName].players[client.number - 1].action = action;
    }
    */
  }
});

function startGameInterval(roomName, numClients) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);
    
    if (!winner) {
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 811 ); // 811 milliseconds corresponds to 74bpm, common for waltz
}

function emitGameState(roomName, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(roomName)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName)
    .emit('gameOver', JSON.stringify({ winner }));
}

io.listen(process.env.PORT || 3000);
