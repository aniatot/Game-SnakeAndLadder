//const snakes = { 99: 54, 87: 36, 62: 19, 17: 7 };
const snakes = { 2: 1};
const ladders = { 3: 22, 6: 25, 20: 29, 30: 90, 57: 76, 72: 91 };

let players = [];
let currentPlayerIndex = 0;
let positions = [0, 0, 0, 0]; // Start positions (outside board)
let totalPlayers = 0;

var winnerMessage = '';
const playerColors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

function setupGame(numPlayers) {
  totalPlayers = numPlayers;
  document.getElementById('player-setup').classList.add('d-none');
  document.getElementById('game-board').classList.remove('d-none');

  // Initialize players and create their tokens
  for (let i = 0; i < numPlayers; i++) {
    players.push({ color: playerColors[i], position: 0 }); // Start outside the board
    document.getElementById('turn-indicator').style.color = playerColors[i];
  }
  // Initially park all players in the Start cell
  updatePlayerPositions();
  drawBoard();
  startTimer();
}
// Determine pattern based on row (1-4) and apply respective color class
function addColorsToCells(row,counter,cell) {
  let colorClass;
  switch (row % 4) {
    case 1:
      // Row pattern: ABCDABCDAB
      colorClass = `color-${(counter % 4) + 1}`;
      break;
    case 2:
      // Row pattern: CDABCDABCD
      colorClass = `color-${((counter + 2) % 4) + 1}`;
      break;
    case 3:
      // Row pattern: DABCDABCDA
      colorClass = `color-${((counter + 1) % 4) + 1}`;
      break;
    case 0:
      // Row pattern: BCDABCDABC
      colorClass = `color-${((counter + 3) % 4) + 1}`;
      break;
  }
    cell.classList.add(colorClass);
}

function drawBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  let counter = 100;
  let reverse = false;

  // Create board cells from 100 to 1
  for (let row = 0; row < 10; row++) {
    const rowCells = [];

    for (let col = 0; col < 10; col++) {
      const cell = document.createElement('div');
      cell.className = 'board-cell cell-'+counter;

      // Wrap the number in a span
      const span = document.createElement('span');
      span.className = 'cell-text';
      span.innerText = counter;
      cell.appendChild(span); // Add the number span to the cell

      addColorsToCells(row,counter,cell);

      // Add snake or ladder background to both source and destination cells      
      // Highlight the destination cells of the snake and ladder
      if (snakes[counter] || Object.values(snakes).includes(counter)) {
        cell.classList.add('snake');
      } else if (ladders[counter] || Object.values(ladders).includes(counter)) {
        cell.classList.add('ladder');
      }
/*       if (Object.values(snakes).includes(counter)) {
        cell.classList.add('snake');
      } else if (Object.values(ladders).includes(counter)) {
        cell.classList.add('ladder');
      } */

      // Check if any player is on this cell
      players.forEach((player, index) => {
        if (player.position === counter) {
          generatePlayerToken(cell, player, index);
        }
      });
      rowCells.push(cell);
      counter--;
    }
    if (reverse) {
      rowCells.reverse();
    }
    reverse = !reverse;
    rowCells.forEach((cell) => board.appendChild(cell));
  }
}

function updatePlayerPositions() {
  // Remove all existing player tokens in board
  const board = document.getElementById('board-wrapper');
  board.querySelectorAll('.player-token').forEach(token => token.remove());

  players.forEach((player, index) => {
    const playerPosition = player.position;
    // Select the specific cell where the player's position matches
    let targetCell = document.getElementsByClassName(`cell-${playerPosition}`);
    //const targetCell = board.querySelector(`.cell .cell-text:nth-child(${playerPosition})`);

    if (targetCell[0]) {
      generatePlayerToken(targetCell[0], player, index);
    }
  });
}

/* function parkPlayersAtStart() {
const startCell = document.getElementById('start');
players.forEach((player, index) => {
  generatePlayerToken(startCell, player, index);
});
}
 */
function generatePlayerToken(cell, player, playerIndex) {
  const token = document.createElement('div');
  token.classList.add('player-token');
  token.classList.add(`token-${playerIndex + 1}`); // Add unique class based on player index
  token.style.backgroundColor = player.color;
  token.title = `Player ${playerIndex + 1}`; // Optional: can still keep this for reference
  token.classList.add('slide'); // Add sliding animation
  cell.appendChild(token); // Park the player token in the Start cell
}

function removePlayerToken(cell, playerIndex) {
  const tokens = Array.from(cell.getElementsByClassName('player-token'));
  const playerClass = `token-${playerIndex + 1}`; // Construct the class for the player's token
  
  tokens.forEach((token) => {
    if (token.classList.contains(playerClass)) {
      cell.removeChild(token); // Remove the player's token from the cell
    }
  });
}

function updateTurnIndicator() {
  const currentPlayer = players[currentPlayerIndex];
  let turnIndicator = document.getElementById('turn-indicator');
  turnIndicator.innerText = `Player ${currentPlayerIndex + 1}'s Turn`;  
  turnIndicator.style.color = currentPlayer.color;
}

document.getElementById('roll-dice').addEventListener('click', rollDice);
function rollDice() {
  const dice = document.getElementById('roll-dice');  // Targeting the button
  const cube = document.getElementById('cube'); // Targeting the cube element
  dice.classList.add('animate');
  cube.classList.add('animate');
  // Final dice value after "roll"
  const diceValue = Math.floor(Math.random() * 6) + 1;
  // Update the cube's content with new dice value (dots)
  setTimeout(() => {
    cube.innerHTML = generateDots(diceValue);
  }, 7);  // Wait for 1.5s (duration of the animation)
 // Update Dots based on Final Result after animation ends
setTimeout(() => {
    // Call movePlayer after dice roll
    movePlayer(currentPlayerIndex, diceValue);

    // Remove animation class after animation completes
    dice.classList.remove('animate');
    cube.classList.remove('animate');
  }, 15);  // Wait for 1.5s (duration of the animation)
}

// Helper function to generate dots based on diceValue
function generateDots(diceValue) {
  let dotsHtml = '';

  switch (diceValue) {
    case 1:
      dotsHtml = '<div class="dot dot1"></div>';
      break;
    case 2:
      dotsHtml = `
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>`;
      break;
    case 3:
      dotsHtml = `
        <div class="dot 3-dot dot1"></div>
        <div class="dot 3-dot dot2"></div>
        <div class="dot 3-dot dot3"></div>`;
      break;
    case 4:
      dotsHtml = `
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
        <div class="dot dot4"></div>`;
      break;
    case 5:
      dotsHtml = `
        <div class="dot 3-dot dot1"></div>
        <div class="dot 3-dot dot2"></div>
        <div class="dot 3-dot dot3"></div>
        <div class="dot dot4"></div>
        <div class="dot dot5"></div>`;
      break;
    case 6:
      dotsHtml = `
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
        <div class="dot dot4"></div>
        <div class="dot dot5"></div>
        <div class="dot dot6"></div>`;
      break;
  }

  return dotsHtml;
}


function movePlayer(playerIndex, diceValue) {
  const currentPlayer = players[playerIndex];
  let newPosition = currentPlayer.position;  // Start from the current position

  // Handle initial roll to start the game
  if (currentPlayer.position === 0) {
    if (diceValue === 1) {
      showAlert(`Hurray!! Player ${playerIndex + 1} rolled a 1! Let's Begin!`, 'info');  // initial roll
      newPosition = 1;  // Start the game at position 1
      const startCell = document.getElementById('start');
      //removePlayerToken(startCell, playerIndex);
    } else {
      showAlert(`Player ${playerIndex + 1} needs to roll a 1 to start!`, 'warning');  // Wait for a 1
      moveToNextPlayer();
      return;  // End this player's turn
    }
  } else {
    // Normal movement once the game has started
    newPosition += diceValue;
  }
  
  // Check if new position has snakes or ladders
  if (snakes[newPosition]) {
    showAlert(`Oh no! Player ${playerIndex + 1} got bitten by a snake!`, 'warning');
    newPosition = snakes[newPosition];
  } else if (ladders[newPosition]) {
    showAlert(`Yay! Player ${playerIndex + 1} climbed a ladder!`, 'success');
    newPosition = ladders[newPosition];
  }

  // Bounce back if the player goes past 100
  if (newPosition > 100) {
    showAlert(`Player ${playerIndex + 1} bounced back!`, 'info');
    newPosition = 100 - (newPosition - 100);
  }

  // Move to Home if the player reaches 100
  if (newPosition === 100) {
    let currentPlayerToken = document.getElementsByClassName(`token-${playerIndex + 1}`);
    //Removing all token instances of the current player as it will move to home
    currentPlayerToken[0].parentElement.removeChild(currentPlayerToken[0]);
    // Move player to the home cell and remove from the board
    //moveToHome(playerIndex);  
    newPosition = 101;  
    showAlert(`Congratulations! Player ${playerIndex + 1} has won!`, 'success');
    return removePlayerFromGame(playerIndex, newPosition); // Player has finished the game
  }

  // Update the player's position
  currentPlayer.position = newPosition;
  updatePlayerPositions();
  // If dice was not 1, switch to the next player
  if (diceValue !== 1) {
    moveToNextPlayer();
  }
  //drawBoard();
}

//Move to next player
function moveToNextPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;  // Update player index    
  updateTurnIndicator();
}

// Move the player to the Home cell
function moveToHome(playerIndex) {
  const homeCell = document.getElementById('home');
  const player = players[playerIndex];

  // Move the player token to Home
  generatePlayerToken(homeCell, player, playerIndex);
}

function removePlayerFromGame(playerIndex) {
  // Remove the player from the players array by filtering them out  
  moveToHome(playerIndex);
  const updatedPlayers = players.filter((_, index) => index !== playerIndex);
  showWinner(playerIndex);
  players.splice(playerIndex, 1);
  totalPlayers--; //reduce players count
  // If there are still players left, continue the game with the next player
  if (updatedPlayers.length > 0) {
    moveToNextPlayer();
  } else {
    // If no players are left, the game ends
    showAlert("Game Over! All players have reached home.");
    restartGame();
  }
}

function showWinner(playerIndex) {
  winnerMessage += winnerMessage.length === 0 
  ? `Player ${playerIndex + 1} wins! ` 
  : `Player ${playerIndex + 1} completed! `;
  document.getElementById('winner-message').innerText = winnerMessage;
  $('#winner-dialog').modal('show');
}

function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alert-container');
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.appendChild(alertDiv);
  
  setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 200); // Remove after fade out
  }, 3000); // Auto-dismiss after 5 seconds
}

function restartGame() {
  players = [];
  positions = [0, 0, 0, 0];
  currentPlayerIndex = 0;
  $('#winner-dialog').modal('hide');
  const homeCell = document.getElementById('home');
  homeCell.innerHTML = '<span>Start</span>'; // Clear any previous tokens
  const startCell = document.getElementById('start');
  startCell.innerHTML = '<span>Home</span>'; // Clear existing tokens
  winnerMessage = '';
  document.getElementById('player-setup').classList.remove('d-none');
  document.getElementById('game-board').classList.add('d-none');
}
