import express from "express";
import http from "http";
import { Server } from "socket.io";
import PokemonApiFetcher from "./model/PokemonApiFetcher.js";
import BattleModel from "./model/BattleModel.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/get-default-pokemon", async (req, res) => {
  const defaultPokemon = await PokemonApiFetcher.getDefaultPokemon();
  res.json(defaultPokemon);
});

app.get("/get-pokemon-moves/:name", async (req, res) => {
  const pokemonMoves = await PokemonApiFetcher.getPokemonMoves(req.params.name);
  res.json(pokemonMoves);
});

// Get the stats of the selected pokemon
app.get("/get-pokemon-data/:name", async (req, res) => {
  const { name } = req.params;

  const pokemonData = await PokemonApiFetcher.createOnePokemonStats(name);
  res.json(pokemonData);
});

// Get the moves of the selected pokemon
app.get("/get-move-data/:move", async (req, res) => {
  const { move } = req.params;

  const moveData = await PokemonApiFetcher.createOneMoveData(move);
  res.json(moveData);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

(async () => {
  const model = new BattleModel();
  await model.setPlayer("1234", "harrison", {
    charizard: ["flamethrower", "air-slash", "dragon-claw", "earthquake"],
    blastoise: ["hydro-pump", "ice-beam", "surf", "bite"],
  });

  console.log(`player 1 ${model.getPlayer1ID()}`);
  console.log(model.getPlayers());

  await model.setPlayer("5678", "pham", {
    alakazam: ["psychic", "shadow-ball", "recover", "calm-mind"],
    machamp: ["dynamic-punch", "earthquake", "stone-edge", "bulk-up"],
  });

  console.log(model.getPlayers());

  model.addMove("1234", { action: "switch", index: 1 });
  model.addMove("5678", { action: "switch", index: 1 });

  console.log(model.getMoves());
  if (model.readyToHandleTurn()) {
    model.handleTurn();
    console.log(model.getMessages());
  }
})();

// model.addMove("1234", { action: "switch", index: 2 });
// model.addMove("5678", { action: "switch", index: 2 });

// if (model.readyToHandleTurn()) {
//   model.handleTurn();
//   console.log(model.getMessages());
// }

// io.on("connection", async (socket) => {
//   console.log(`Player ${socket.id} has connected`);

//   await model.setPlayer(socket.id, "harrison", {
//     charizard: ["flamethrower", "air-slash", "dragon-claw", "earthquake"],
//     blastoise: ["hydro-pump", "ice-beam", "surf", "bite"],
//   });

//   await model.setPlayer(socket.id, "pham", {
//     alakazam: ["psychic", "shadow ball", "recover", "calm mind"],
//     machamp: ["dynamic punch", "earthquake", "stone edge", "bulk up"],
//   });

//   socket.on("setPlayer", async (data) => {
//     await model.setPlayer(socket.id, data.name, data.teamSelection);
//     console.log(model.checkSetStatus());
//   });

//   socket.on("submitMove", (data) => {
//     model.addMove(socket.id, data);

//     if (model.readyToHandleTurn()) {
//       model.handleTurn();
//       model.getMessages();
//     }
//   });

//   socket.emit("update-game", { message: "hello" });
// });
