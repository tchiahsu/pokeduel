import { Request, Response } from "express";
import PokemonApiFetcher from "../services/PokemonApiFetcher.js";
import BotPlayer from "../model/BotPlayer.js"

// Gets the default Pokemon
// GET /pokemon/default
export async function getDefaultPokemon(req: Request, res: Response) {
  const defaultPokemon = await PokemonApiFetcher.getDefaultPokemon();
  res.json(defaultPokemon);
}

// Gets the stats for a pokemon
// GET /pokemon/:name/stats
export async function getPokemonStats(req: Request, res: Response) {
  const pokemonName = req.params.name;
  const pokemonData = await PokemonApiFetcher.createOnePokemonData(pokemonName, []);
  res.json(pokemonData);
}

// Gets the moves for a pokemon
// GET /pokemon/:name/moves
export async function getPokemonMoves(req: Request, res: Response) {
  const pokemonMoves = await PokemonApiFetcher.getPokemonMoves(req.params.name);
  res.json(pokemonMoves);
}

export async function getRandomPokemonTeam(req: Request, res: Response) {
  const bot = new BotPlayer();
  await bot.generateRandomTeam();
  res.json(bot.getTeam());
}