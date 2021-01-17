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
  
  var state = {clients : {} , world : {} , gridwidth : GRID_SIZE, gridheight : GRID_SIZE};
  
  state['world'] = initWorld();
   
  var i,ii,playerView;
  for (i=1 ; i <= numClients; i++){
    state['clients'][i] = {playerView : {}, playerPos : {} };
    state['clients'][i]['playerPos']['x'] = 0;
    state['clients'][i]['playerPos']['y'] = i;
    
    playerView =  getPlayerView(state['world'],state['clients'][i]['playerPos']);
    state['clients'][i]['playerView'] = playerView;
  }
  
  return state;
}


function gameLoop(state) {
  // update game state
  // if game over, return PlayerNumber of winner
  // else return false
  
  if (!state) {
    console.log('failed to receive gamestate');
    return;
  }
  
  return false 
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

function initWorld(){
  var state = {};
  
  var i,ii;
  for (i=0 ; i< GRID_SIZE; i++){
    state[i] = {};
    for (ii = 1; ii<GRID_SIZE;ii++){
      state[i][ii] = {blockName : 'wall', fillId:39};
    }
    state[i][0] = {blockName : 'character', fillId:37};
  }
  return state;
}

function getPlayerView(worldState, playerPos){
  const width = Math.floor(GRID_SIZE/2);
  const height = Math.floor(GRID_SIZE/2);
  const emptySquare = {blockName : 'empty', fillId : 40};
  const x = playerPos['x'];
  const y = playerPos['y'];
  var playerView = {};

  var i,ii,x_i,y_ii;
  for (i=0; i<2*width;i++){
    x_i = x+i-width;
    playerView[i] = {};
    for (ii=0; ii<2*height;ii++){
      y_ii = y+ii-height;
      if (x_i in worldState){ 
        if (y_ii in worldState[x_i]){
          playerView[i][ii] = worldState[x_i][y_ii];
        } else {
          playerView[i][ii] = emptySquare;
        }
      } else {
      playerView[i][ii] = emptySquare;
      }
    }
  }
  return playerView;
}
