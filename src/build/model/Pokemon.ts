import pokemonData from "./pokemon.json" with { "type": "json"};
import Move from "./Move.js"

/**
 * Creates a Pokemon with the passed-in stats.
 */
export default class Pokemon {
  private name: string;
  private types: string[];
  private hp: number;
  private atk: number;
  private def: number;
  private spAtk: number;
  private spDef: number;
  private speed: number;
  private moves: Move[];
  private fainted: boolean;
  private status: string;

  /**
   * Constructs a new Pokémon instance with the given stats and moves.
   * @param name - The name of the Pokémon
   * @param types - The types of the Pokémon (e.g., ["Fire", "Flying"])
   * @param hp - The current HP (health points) of the Pokémon
   * @param atk - The physical attack stat
   * @param def - The physical defense stat
   * @param spAtk - The special attack stat
   * @param spDef - The special defense stat
   * @param speed - The speed stat
   * @param moves - An array of Move objects the Pokémon can use
   */
  constructor(name: string, types: string[], hp: number, atk: number, def: number, spAtk: number, spDef: number, speed: number, moves: Move[]) {
    this.name = name;
    this.types = types;
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.spAtk = spAtk;
    this.spDef = spDef;
    this.speed = speed;
    this.moves = moves;
    this.fainted = true;
  }

  /**
   * Returns the name of the Pokémon.
   * @returns The name as a string.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Returns the types of the Pokémon.
   * @returns An array of type strings.
   */
  public getTypes(): string[] {
    return this.types;
  }

  /**
   * Method to get the hp of the Pokemon.
   * @returns hp of the Pokemon
   */
  public getHp(): number {
    return this.hp;
  }

  /**
   * Returns the physical attack stat of the Pokémon.
   * @returns Attack stat as a number.
   */
  public getAtk(): number {
    return this.atk;
  }

  /**
   * Returns the physical defense stat of the Pokémon.
   * @returns Defense stat as a number.
   */
  public getDef(): number {
    return this.def;
  }

  /**
   * Method to get the special attack of the Pokemon.
   * @returns Special attack of the Pokemon
   */
  public getSpAtk(): number {
    return this.spAtk;
  }

  /**
   * Method to get the special defense of the Pokemon.
   * @returns Special defense of the Pokemon as a number
   */
  public getSpDef(): number {
    return this.spDef;
  }

  /**
   * Method to get the speed of the Pokemon.
   * @returns Speed of the Pokemon as a number
   */
  public getSpeed(): number {
    return this.speed;
  }

  /**
   * Method to get the moves of the Pokemon.
   * @returns the array of moves of the Pokemon
   */
  public getMoves(): Move[] {
    return this.moves;
  }

  /**
   * Method to get a move from the Pokemon's moves.
   * @returns a move of the Pokemon
   */
  public getMove(move: number): Move {
    return this.moves[move];
  }

  /**
   * Method to get the effect status on a pokemon
   * @returns the status effect on the pokemon
   */
  public getStatus(): string {
    return this.status;
  }

  /**
   * Method to sets the effect status on a pokemon
   */
  public setStatus(status: string): void {
    this.status = status;
  }

  /**
   * Reduces the hp of the Pokemon by the damage.
   * @param damage damage caused to the Pokemon
   */
  public takeDamage(damage: number): void {
    this.hp -= damage;
  }

  /**
   * The method lowers the value of the stat by the number passed in.
   * @param stat the stat of the Pokemon that is to be lowered
   * @param reduce the number by which stat is to be lowered
   */
  public lowerStat(stat: "atk" | "def" | "spAtk" | "spDef" | "speed", reduce: number): void {
    this[stat] -= reduce;
  }

  /**
   * Method that raises the value of the stat by the number passed in.
   * @param stat the stat of the Pokemon that is to be raised
   * @param reduce the number by which stat is to be raised
   */
  public raiseStat(stat: "atk" | "def" | "spAtk" | "spDef" | "speed", raise: number): void {
    this[stat] += raise;
  }

  /**
   * Method that returns the active status of the Pokemon.
   * @returns boolean to check whether the Pokemon is fainted
   */
  public isFainted(): boolean {
    return this.fainted;
  }
}