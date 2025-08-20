import express from "express";
const router = express.Router();
import { getDefaultPokemon, getPokemonMoves, getPokemonStats, getRandomPokemonTeam } from "../controllers/pokemonControllers.js";

// Gets the default Pokemon
// GET /pokemon/default
router.get("/default", getDefaultPokemon);

// Gets the stats for a pokemon
// GET /pokemon/:name/stats
router.get("/:name/stats", getPokemonStats);

// Gets the moves for a pokemon
// GET /pokemon/:name/moves
router.get("/:name/moves", getPokemonMoves);

// Gets a random pokemon team
// GET /pokemon/random-team
router.get("/random-team", getRandomPokemonTeam);

export default router;
