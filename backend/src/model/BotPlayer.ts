import PokemonApiFetcher from "./PokemonApiFetcher.js";
import { TeamSelection } from "../types/types.js";

/**
 * A class representing a bot Pokémon trainer that can randomly generate a team
 * and make automated decisions during a battle.
 */
export default class BotPlayer {
  // The identifiers for the bot player
  private ID: string = "BOT_PLAYER_ID";
  private NAME: string = "BOT_PLAYER";

  // The range of pokemon the bot can have
  private MIN_TEAM_AMOUNT = 4;
  private MAX_TEAM_AMOUNT = 6;

  // The range of pokemon from the entire list of pokemon the bot can use
  private MIN_POKEMON_SEARCH_RANGE = 1;
  private MAX_POKEMON_SEARCH_RANGE = 1025;

  // The bot's team selection
  private team: TeamSelection = {};
  // Maps the current pokemon to the number of moves they have
  private pokemonToNumMoves: Record<number, number> = {};
  // The current pokemon of the bot (used for switching)
  private currentPokemonIndex = 0;

  /**
   * Returns the bot's ID.
   *
   * @returns The bot's ID.
   */
  public getID(): string {
    return this.ID;
  }

  /**
   * Returns the bot's name.
   *
   * @returns The bot's name.
   */
  public getName(): string {
    return this.NAME;
  }

  /**
   * Returns the bot's team selection.
   *
   * @returns The bot's team selection.
   */
  public getTeam(): TeamSelection {
    return this.team;
  }

  /**
   * Generates a random team of Pokemon with random moves for the bot.
   *
   * @returns A void promise.
   */
  public async generateRandomTeam(): Promise<void> {
    const teamSelection: TeamSelection = {};
    const teamAmount: number = Math.floor(
      Math.random() * (this.MAX_TEAM_AMOUNT - this.MIN_TEAM_AMOUNT + 1) + this.MIN_TEAM_AMOUNT
    );

    for (let i = 0; i < teamAmount; i++) {
      const pokemonIndex = this.generateRandomPokemonIndex();
      const pokemonName: string = await PokemonApiFetcher.getPokemonNameByIndex(pokemonIndex);
      const pokemonMoves = await PokemonApiFetcher.getPokemonMoves(pokemonName);
      const moveSelection = this.generateRandomMoves(pokemonMoves);
      this.pokemonToNumMoves[i] = moveSelection.length;
      teamSelection[pokemonName] = moveSelection;
    }

    this.team = teamSelection;
  }

  /**
   * Generates a random Pokedex index within the allowed range.
   *
   * @returns A random Pokemon index.
   */
  private generateRandomPokemonIndex(): number {
    return Math.floor(
      Math.random() * (this.MAX_POKEMON_SEARCH_RANGE - this.MIN_POKEMON_SEARCH_RANGE + 1) +
        this.MIN_POKEMON_SEARCH_RANGE
    );
  }

  /**
   * Randomly selects up to 4 unique moves from the provided list of possible moves.
   *
   * @param pokemonMoves The full list of possible moves for a Pokémon.
   * @returns An array of 1–4 randomly selected move names.
   */
  private generateRandomMoves(pokemonMoves: string[]): string[] {
    const moves: string[] = [];
    const usedIndices: Set<number> = new Set<number>();
    const numMoves: number = Math.min(pokemonMoves.length, 4);

    while (moves.length < numMoves) {
      const moveIndex = Math.floor(Math.random() * pokemonMoves.length);
      if (!usedIndices.has(moveIndex)) {
        moves.push(pokemonMoves[moveIndex]);
        usedIndices.add(moveIndex);
      }
    }

    return moves;
  }

  /**
   * Randomly selects one of the available moves to use as an attack.
   *
   * @returns An index from 0 to the number of moves, representing the selected move.
   */
  public selectAttackMove(): number {
    return Math.floor(Math.random() * this.pokemonToNumMoves[this.currentPokemonIndex]);
  }

  /**
   * Selects the next Pokémon to switch to. Increments the internal index.
   *
   * @returns The index of the next Pokemon in the team.
   */
  public selectSwitchMove(): number {
    this.currentPokemonIndex += 1;
    return this.currentPokemonIndex;
  }
}
