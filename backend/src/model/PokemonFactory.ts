import Pokemon from "./Pokemon.js";
import Move from "./Move.js";
import PokemonApiFetcher from "../services/PokemonApiFetcher.js";
import { PokemonType, MoveType } from "../types/types.js";
/**
 * Class for creating a team of Pokemon from just their name.
 */
export default class PokemonFactory {
  /**
   * Creates a team of Pokemon objects from the player's selection of Pokemon.
   * @param teamSelection An object mapping the player's selection of Pokemon to their moves.
   * @returns An Array of Pokemon objects.
   */
  static async createTeam(teamSelection: Record<string, string[]>): Promise<Pokemon[]> {
    const pokemonData = await PokemonApiFetcher.createFullPokemonData(teamSelection);
    const moveData = await PokemonApiFetcher.createFullMoveData(teamSelection);

    const team: Pokemon[] = [];

    for (const pokemonName of Object.keys(teamSelection)) {
      const pokemon: Pokemon = PokemonFactory.createPokemon(pokemonName, pokemonData, moveData);
      team.push(pokemon);
    }
    // let team = pokemonNames.map((pokemonName) => this.createPokemon(pokemonName.toLowerCase()));
    return team;
  }

  /**
   * Creates a single Pokemon object from its name by retrieving its stats and moves from the dataset.
   * @param pokemonName The name of the Pokemon to create.
   * @param pokemonData Data about all of the selected pokemon from the Pokemon API.
   * @param moveData Data about all of the selected moves from the Pokemon API.
   * @returns A Pokemon object with stats and moves initialized.
   */
  static createPokemon(
    pokemonName: string,
    pokemonData: Record<string, PokemonType>,
    moveData: Record<string, MoveType>
  ) {
    const data = pokemonData[pokemonName as keyof typeof pokemonData];
    const moves = data.moves.map((moveName: string) => PokemonFactory.createMove(moveName, moveData));
    let pokemon = new Pokemon(
      data.name,
      data.types,
      data.hp,
      data.attack,
      data.defense,
      data["special-attack"],
      data["special-defense"],
      data.speed,
      moves, // Move[]
      data.frontSprite,
      data.backSprite
    );
    return pokemon;
  }

  /**
   * Creates a Move object from its name by retrieving its details from the move dataset.
   * @param currentMove the name of the move to create.
   * @param moveData Data about all of the selected moves from the Pokemon API.
   * @returns a Move object with its properties initialized.
   */
  static createMove(currentMove: string, moveData: Record<string, MoveType>) {
    const data = moveData[currentMove as keyof typeof moveData];
    let move = new Move(
      data.name,
      data.type,
      data.category,
      data.power,
      data.accuracy,
      data.pp,
      data.effect,
      data.effectChance
    );
    return move;
  }
}
