import PokemonApiFetcher from "../services/PokemonApiFetcher.js";
import { TeamSelection } from "../types/types.js";

/**
 * A class representing a bot Pokemon trainer that can randomly generate a team
 * and make automated decisions during a battle.
 */
export default class BotPlayer {
  // The identifiers for the bot player
  private ID: string = "BOT_PLAYER_ID";
  private NAME: string = "COMPUTER";

  // The range of Pokemon the bot can have
  private MIN_TEAM_AMOUNT = 4;
  private MAX_TEAM_AMOUNT = 6;

  // The range of Pokemon from the entire list of Pokemon the bot can use
  private MIN_POKEMON_SEARCH_RANGE = 1;
  private MAX_POKEMON_SEARCH_RANGE = 1025;

  // The bot's team selection
  private team: TeamSelection = {};
  // Maps the current Pokemon to the number of moves they have
  private pokemonToNumMoves: Record<number, number> = {};
  // The current Pokemon of the bot (used for switching)
  private currentPokemonIndex = 0;

  // Generic team used as a fallback in case the creation of a team fails.
  private genericTeam = {
    pikachu: ["volt-tackle", "iron-tail", "quick-attack", "thunderbolt"],
    charizard: ["flare-blitz", "air-slash", "blast-burn", "dragon-pulse"],
    venusaur: ["sludge-bomb", "giga-drain", "sleep-powder", "frenzy-plant"],
    blastoise: ["focus-blast", "hydro-cannon", "blizzard", "flash-cannon"],
    lapras: ["blizzard", "brine", "psychic", "body-slam"],
    snorlax: ["shadow-ball", "crunch", "blizzard", "giga-impact"],
  };

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
    try {
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
    } catch (error) {
      this.team = this.genericTeam;
    }
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
   * @param pokemonMoves The full list of possible moves for a Pokemon.
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
   * Selects the next Pokemon to switch to. Increments the internal index.
   *
   * @returns The index of the next Pokemon in the team.
   */
  public selectSwitchMove(): number {
    this.currentPokemonIndex += 1;
    return this.currentPokemonIndex;
  }
}
