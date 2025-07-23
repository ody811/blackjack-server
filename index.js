// === server/index.js ===
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createGame, joinGame, playMove } = require("./gameLogic");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Health check for browser
app.get("/", (req, res) => {
  res.send("Blackjack API är igång. Anslut med Socket.IO!");
});

let games = {}; // gameId => game state

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("create_game", ({ playerName }, cb) => {
    const { gameId, gameState } = createGame(playerName, socket.id);
    games[gameId] = gameState;
    socket.join(gameId);
    cb({ gameId, gameState });
  });

  socket.on("join_game", ({ gameId, playerName }, cb) => {
    if (!games[gameId]) return cb({ error: "Game not found" });
    const gameState = joinGame(games[gameId], playerName, socket.id);
    games[gameId] = gameState;
    socket.join(gameId);
    io.to(gameId).emit("update", gameState);
    cb({ gameState });
  });

  socket.on("move", ({ gameId, move }, cb) => {
    const gameState = playMove(games[gameId], socket.id, move);
    games[gameId] = gameState;
    io.to(gameId).emit("update", gameState);
    cb({ gameState });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Optionally handle player removal
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
