import Pokemon from "./Pokemon.js";

/**
 * Represents a player in the game, including their name, team of Pokémon,
 * and the current state of their battle (active Pokémon and remaining ones).
 */
export default class Player {
  private name: string;
  private team: Pokemon[];
  private currentPokemon: number;
  private remainingPokemon: number;
  private faintedPokemon: number[];
  /**
   * Create a new Player instance.
   * @param name The name of the player.
   * @param team An array of Pokémon objects representing the player's team.
   */
  constructor(name: string, team: Pokemon[]) {
    this.name = name;
    this.team = team;
    this.currentPokemon = 0;
    this.remainingPokemon = team.length;
  }

  /**
   * Get the Player's name
   * @returns The player's name as a string.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Get the player's team of Pokémon.
   * @returns An array of Pokémon.
   */
  public getTeam(): Pokemon[] {
    return this.team;
  }

  /**
   * Get the currently active Pokemon.
   * @returns The current Pokémon object.
   */
  public getCurrentPokemon(): Pokemon {
    return this.team[this.currentPokemon];
  }

  /**
   * Returns the number of remaining Pokemon
   * @returns Get the remaining active Pokemon.
   * @returns the number of remaining Pokemon.
   */
  public getRemainingPokemon(): number {
    return this.remainingPokemon;
  }

  /**
   * Returns an array of fainted pokemon's index.
   * @returns array of fainted pokemon index
   */
  public getFaintedPokemon(): number[] {
    return this.faintedPokemon;
  }

  /**
   * Adds the fainted Pokemon's index to the faintedPokemon array.
   * @param faintedIndex the index of the fainted Pokemon
   */
  public addFaintedPokemon(faintedIndex: number): void {
    this.faintedPokemon.push(faintedIndex);
  }

  /**
   * Switch the currently active Pokémon to another in the team.
   * @param newPokemon The index of the new Pokémon to switch to.
   */
  public switchPokemon(newPokemon: number): void {
    this.currentPokemon = newPokemon;
  }

  /**
   * Reduce the number of remaining usable Pokémon by 1.
   */
  public reduceRemainingPokemon() {
    this.remainingPokemon -= 1;
  }

  /**
   * Check if the player has any remaining usable Pokémon.
   * @returns True if at least one Pokémon is still usable, otherwise false.
   */
  public hasRemainingPokemon(): boolean {
    return this.remainingPokemon > 0;
  }

  /**
   * Returns the currentPokemon's index in the team array.
   * @returns the index of the current pokemon
   */
  public getCurrentPokemonIndex(): number {
    return this.currentPokemon;
  }
}
