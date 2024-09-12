import React, { useState, useEffect } from 'react';
import Handlebars from 'handlebars';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import templateFile from './snakeAndLadderTemplate.hbs'; // Ensure this path is correct
import './styles.css'; // Add your styles here
import './dice.css';   // Add dice styles

const snakes = { 99: 54, 87: 36, 62: 19, 17: 7 };
const ladders = { 3: 22, 6: 25, 20: 29, 57: 76, 72: 91 };
const playerColors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

const SnakeAndLadder = () => {
  const [players, setPlayers] = useState([]); // track player positions
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1); // dice value displayed in UI

  useEffect(() => {
    const template = Handlebars.compile(templateFile);
    const data = {
      playerOptions: [
        { count: 2, color: 'btn-primary' },
        { count: 3, color: 'btn-success' },
        { count: 4, color: 'btn-warning' },
      ]
    };
    document.getElementById('game-container').innerHTML = template(data);
    setGameState();

    // Draw board once players are set up
    if (totalPlayers > 0) {
      drawBoard();
    }
  }, [totalPlayers]); // draw board only after players are set up

  const setGameState = (numPlayers) => {
    setTotalPlayers(numPlayers);
    const initialPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      color: playerColors[i],
      position: 0,
    }));
    setPlayers(initialPlayers);
    //setPositions(Array(numPlayers).fill(0)); // set player positions to 0
  };

  const drawBoard = () => {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear board before rendering
    let counter = 100;
    let reverse = false;

    for (let row = 0; row < 10; row++) {
      const rowCells = [];
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        const span = document.createElement('span');
        span.className = 'cell-text';
        span.innerText = counter;
        cell.appendChild(span);
        rowCells.push(cell);
        counter--;
      }
      if (reverse) rowCells.reverse();
      reverse = !reverse;
      rowCells.forEach((cell) => board.appendChild(cell));
    }
  };

  const rollDice = () => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(diceRoll);
    setTimeout(() => movePlayer(currentPlayerIndex, diceRoll), 1500);
  };

  const movePlayer = (playerIndex, diceValue) => {
    const currentPosition = players[playerIndex];
    let newPosition = currentPosition + diceValue;

    // Check for snakes or ladders
    if (snakes[newPosition]) newPosition = snakes[newPosition];
    if (ladders[newPosition]) newPosition = ladders[newPosition];
    if (newPosition > 100) newPosition = 100 - (newPosition - 100);

    const newPositions = [...players];
    newPositions[playerIndex] = newPosition;
    setPlayers(newPositions);

    if (newPosition === 100) {
      alert(`Player ${playerIndex + 1} has won!`);
    } else {
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % totalPlayers);
    }
  };

  return (
    <div id="game-container">
      <button onClick={rollDice}>Roll Dice</button>
      <h3>Dice Value: {diceValue}</h3>
    </div>
  );
};

export default SnakeAndLadder;
