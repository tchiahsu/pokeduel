import PokemonApiFetcher from "../services/PokemonApiFetcher.js";
import { Request, Response } from "express";

// Gets the data for a move
// GET /moves/:name
export async function getMoveData(req: Request, res: Response) {
  const moveName = req.params.name;
  const moveData = await PokemonApiFetcher.createOneMoveData(moveName);
  res.json(moveData);
}
