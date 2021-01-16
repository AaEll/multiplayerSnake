const { GRID_SIZE } = require('./constants');



module.exports = {
  initGame,
  gameLoop,
  updateActionQueued,
}

function initGame(numClients) {
  const state = createGameState(numClients)
  return state;
}

function createGameState(numClients) {
  
  var state = {'clients' : {} , blablabla};
  
  for (var i=0 ; i < numClients; i++){
    state['clients'][i] = {blablabla}
  }	  
  
  return state;
}

function gameLoop(state) {
  // update game state
  // if game over, return PlayerNumber of winner
  // else return false
  
  if (!state) {
    return;
  }
  
  
}

function updateActionQueued(keyCode, currentActionQueued) {
  switch (keyCode) {
    case 37: { // left
	  if (currentActionQueued['x'] == 1){
        return {x : 0 , y: 0};
	  }
	  else{
        return { x: -1, y: 0 };  
	  }
    }
    case 38: { // down
      if (currentActionQueued['y'] == 1){
        return {x : 0 , y: 0};
	  }
	  else{
        return { x: 0, y: -1 };  
	  }	
    }
    case 39: { // right
      if (currentActionQueued['x'] == -1){
        return {x : 0 , y: 0};
	  }
	  else{
        return { x: 1, y: 0 };
	  }
    }
    case 40: { // up
      if (currentActionQueued['y'] == -1){
        return {x : 0 , y: 0};
	  }
	  else{
        return { x: 0, y: 1 };
      }
    }
  }
}
