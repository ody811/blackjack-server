import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://blackjack-api-l0ne.onrender.com"); // Ändra om du byter backend-URL

export default function App() {
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("update", (data) => {
      setGameState(data);
    });
  }, []);

  const createGame = () => {
    socket.emit("create_game", { playerName }, ({ gameId, gameState }) => {
      setGameId(gameId);
      setGameState(gameState);
      setJoined(true);
    });
  };

  const joinGame = () => {
    socket.emit("join_game", { gameId, playerName }, ({ gameState }) => {
      setGameState(gameState);
      setJoined(true);
    });
  };

  const sendMove = (move) => {
    socket.emit("move", { gameId, move }, ({ gameState }) => {
      setGameState(gameState);
    });
  };

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Blackjack</h2>
        <input placeholder="Ditt namn" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        <br />
        <button onClick={createGame}>Skapa spel</button>
        <br />
        <input placeholder="Spel-ID" value={gameId || ""} onChange={(e) => setGameId(e.target.value)} />
        <button onClick={joinGame}>Gå med i spel</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Välkommen, {playerName}!</h2>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
      <button onClick={() => sendMove("hit")}>Hit</button>
      <button onClick={() => sendMove("stand")}>Stand</button>
    </div>
  );
}