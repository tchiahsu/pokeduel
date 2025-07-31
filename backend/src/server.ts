import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import PokemonApiFetcher from "./model/PokemonApiFetcher.js";
import BattleModel from "./model/BattleModel.js";
import RoomManager from "./services/RoomManager.js";
import ShortUniqueId from "short-unique-id";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/pokemon/default", async (req, res) => {
  const defaultPokemon = await PokemonApiFetcher.getDefaultPokemon();
  res.json(defaultPokemon);
});

app.get("/pokemon/:name/moves", async (req, res) => {
  const pokemonMoves = await PokemonApiFetcher.getPokemonMoves(req.params.name);
  res.json(pokemonMoves);
});

// Get the stats of the selected pokemon
app.get("/pokemon/:name/stats", async (req, res) => {
  const pokemonName = req.params.name;
  const pokemonData = await PokemonApiFetcher.createOnePokemonData(
    pokemonName,
    []
  );
  res.json(pokemonData);
});

// Get the moves of the selected pokemon
app.get("/moves/:name", async (req, res) => {
  const moveName = req.params.name;

  const moveData = await PokemonApiFetcher.createOneMoveData(moveName);
  res.json(moveData);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

const roomManager: RoomManager = new RoomManager();

io.on("connection", (socket) => {
  console.log(`Player ${socket.id} has connected`);

  socket.on("joinRoom", (roomID) => {
    socket.join(roomID);
    if (!roomManager.isRoom(roomID)) {
      roomManager.createRoom(roomID);
    }
    roomManager.addPlayerToRoom(socket.id, roomID);
    socket.emit("joinRoom", { message: `Joined room ${roomID}` });
  });

  socket.on("setPlayer", async (data) => {
    const roomID: string = roomManager.getPlayerRoom(socket.id);
    const battleModel: BattleModel = roomManager.getBattleModel(roomID);
    await battleModel.setPlayer(socket.id, data.name, data.teamSelection);
    if (battleModel.hasTwoPlayers()) {
      io.to(roomID).emit("gameStart", () => {
        console.log(`Room ${roomID}'s battle has begun`);
      });
    }
  });

  socket.on("submitMove", (data) => {
    const roomID: string = roomManager.getPlayerRoom(socket.id);
    const battleModel: BattleModel = roomManager.getBattleModel(roomID);
    battleModel.addMove(socket.id, data);
    if (battleModel.readyToHandleTurn()) {
      battleModel.handleTurn();
      const turnSummary = battleModel.getTurnSummary();
      const player1ID = battleModel.getPlayer1ID();
      const player2ID = battleModel.getPlayer2ID();
      io.to(player1ID).emit("turnSummary", turnSummary[player1ID]);
      io.to(player2ID).emit("turnSummary", turnSummary[player2ID]);
    }
  });

  socket.on("disconnect", () => {
    const roomID: string = roomManager.getPlayerRoom(socket.id);
    const battleModel: BattleModel = roomManager.getBattleModel(roomID);
    roomManager.removePlayerFromRoom(socket.id);
    if (battleModel && battleModel.hasTwoPlayers()) {
      const remainingPlayer =
        socket.id === battleModel.getPlayer1ID()
          ? battleModel.getPlayer2ID()
          : battleModel.getPlayer1ID();
      io.to(remainingPlayer).emit("endGame", {
        message: `Opponent has disconnected`,
      });
    } else if (roomManager.isWaitingRoomEmpty(roomID)) {
      roomManager.deleteRoom(roomID);
    }
  });
});

app.post("/room", (req, res) => {
  const { randomUUID } = new ShortUniqueId({ length: 10 });
  let roomID: string = randomUUID();
  while (roomManager.isRoom(roomID)) {
    roomID = randomUUID();
  }
  roomManager.createRoom(roomID);
  res.status(200).json({ id: roomID });
});

app.delete("/room/:id", (req, res) => {
  const roomID = req.params.id;
  roomManager.deleteRoom(roomID);
  res.status(200).json({ message: `Room ${roomID} deleted` });
});

app.get("/room/:id", (req, res) => {
  const roomID = req.params.id;
  if (!roomManager.isRoom(roomID)) {
    return res
      .status(404)
      .json({ available: false, message: `Room ${roomID} not found` });
  } else if (roomManager.IsRoomFull(roomID)) {
    return res
      .status(409)
      .json({ available: false, message: `Room ${roomID} is full` });
  }

  return res
    .status(200)
    .json({ available: true, message: `Room ${roomID} found` });
});
