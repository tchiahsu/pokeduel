import express from "express";
import http from "http";
import { Server } from "socket.io";
import PokemonApiFetcher from "./model/PokemonApiFetcher.js";
import BattleModel from "./model/BattleModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8000;

app.use(express.json());

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

//Testing
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
