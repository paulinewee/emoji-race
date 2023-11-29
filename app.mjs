import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import url from "url";
import path from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Set up __dirname equivalent in ESM
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize the game state
let currentState = {
  player1Position: 0,
  player2Position: 0,
  winner: null,
};

io.on("connection", (socket) => {
  console.log("a user connected");

  // Emit the current state to the new user
  socket.emit("state", currentState);

  socket.on("move", (data) => {
    // Update the current state based on the move
    if (data.player === "player1") {
      currentState.player1Position += 10; // move player 1 by 10px
    } else if (data.player === "player2") {
      currentState.player2Position += 10; // move player 2 by 10px
    }

    // Check if any player has crossed the finish line
    if (currentState.player1Position >= finishLinePosition) {
      currentState.winner = "player1";
    } else if (currentState.player2Position >= finishLinePosition) {
      currentState.winner = "player2";
    }

    // Emit the new state to all users
    io.emit("state", currentState);

    // If there's a winner, emit the winning message
    if (currentState.winner) {
      io.emit("winner", `${currentState.winner} wins!`);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const finishLinePosition = 200; // Example finish line position

server.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
