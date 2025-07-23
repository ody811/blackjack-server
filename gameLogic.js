const { v4: uuidv4 } = require("uuid");

function createGame(playerName, socketId) {
  const gameId = uuidv4();
  const gameState = {
    id: gameId,
    players: [{ name: playerName, socketId, hand: [], bet: 0 }],
    dealer: { hand: [] },
    status: "waiting"
  };
  return { gameId, gameState };
}

function joinGame(gameState, playerName, socketId) {
  if (gameState.players.length >= 6) return gameState;
  gameState.players.push({ name: playerName, socketId, hand: [], bet: 0 });
  return gameState;
}

function playMove(gameState, socketId, move) {
  // Placeholder: implement Hit, Stand, Split, Double, etc.
  return gameState;
}

module.exports = { createGame, joinGame, playMove };