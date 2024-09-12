let timeLeft = 120; // Initial time in seconds
let timerId; // To store the interval ID

function startTimer() {
  const timeDisplay = document.getElementById('time-left');
  
  // Set interval to decrease time by 1 second
  timerId = setInterval(() => {
    timeLeft--;

    // Update the timer display
    timeDisplay.innerText = timeLeft;

    // When the timer reaches 5, do something and reset the timer
    if (timeLeft == 5) {
      showAlert(`Time's running first! Be ready a new surprize in next 5 second...`, 'warning');
      timeDisplay.parentElement.classList.add('warning');
    } 
    //Reset timer
    if (timeLeft <= 0) {
      clearInterval(timerId);  // Stop the interval
      timeLeft = 120;  // Reset the time
      timeDisplay.parentElement.classList.remove('warning');
      performAction();  // Call your custom function to perform the game changes
      startTimer();  // Restart the timer after performing the action
    }
  }, 1000); // 1-second intervals
}

function performAction() {
  // Your logic for what happens every 120 seconds

  // Perform specific game changes here, like updating player turns, adding bonuses, etc.
  // Example: changePlayerTurn();
}
