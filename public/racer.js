// racer.js
import { io } from "/socket.io/socket.io.esm.min.js";
const socket = io();

// Get references to the DOM elements
const player1Btn = document.querySelector(".player1Btn");
const player2Btn = document.querySelector(".player2Btn");
const player1 = document.querySelector(".player1");
const player2 = document.querySelector(".player2");

// Define event listeners for the buttons
player1Btn.addEventListener("click", () => {
  socket.emit("move", { player: "player1" });
});

player2Btn.addEventListener("click", () => {
  socket.emit("move", { player: "player2" });
});

// Listen for state updates from the server
socket.on("state", (state) => {
  // Update the positions of the racers based on the state received from the server
  player1.style.transform = `translateX(${state.player1Position}px)`;
  player2.style.transform = `translateX(${state.player2Position}px)`;

  // Check for a winner
  if (state.winner) {
    alert(`${state.winner} wins!`);
    // Disable buttons after a win
    player1Btn.disabled = true;
    player2Btn.disabled = true;
  }
});
