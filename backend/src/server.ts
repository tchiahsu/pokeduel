import express from "express";
import http from "http";
import { Server } from "socket.io";
import PokemonApiFetcher from "./model/PokemonApiFetcher.js";
import BattleModel from "./model/BattleModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/get-default-pokemon", async (req, res) => {
  const defaultPokemon = await PokemonApiFetcher.getDefaultPokemon();
  res.json(defaultPokemon);
});

app.get("/get-pokemon-moves/:name", async (req, res) => {
  const pokemonMoves = await PokemonApiFetcher.getPokemonMoves(req.params.name);
  res.json(pokemonMoves);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

const model = new BattleModel();
// set player by ids
model.setPlayer1("Harrison", ["gengar", "golem"]);
model.setPlayer2("Bhoomika", ["charizard", "venusaur"]);

io.on("connection", (socket) => {
  console.log(`Player ${socket.id} has connected`);
  socket.on("submit-turn", (data) => {});

  // socket.on("start-game", (data) => {
  //   console.log(`${data.message}`);
  // });
});
