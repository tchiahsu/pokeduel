import PokemonApiFetcher from "./PokemonApiFetcher.js";
import { PlayerSelection } from "../types/types.js";

const genericTeam = {
  venusaur: ["solar-beam", "sludge-bomb", "sleep-powder", "earthquake"],
  charizard: ["flamethrower", "air-slash", "dragon-claw", "earthquake"],
};

export default class BotPlayer {
  private ID: string = "BOT_PLAYER_ID";
  private NAME: string = "BOT_PLAYER";
  private MAX_POKEMON_RANGE = 1026;
  private MIN_POKEMON_RANGE = 1;
  private team: Record<string, string[]>;
  private currentPokemonIndex = 0;

  constructor() {
    this.team = this.generateRandomTeam();
  }

  public getID(): string {
    return this.ID;
  }

  public getName(): string {
    return this.NAME;
  }

  public getTeam() {
    return this.team;
  }

  private generateRandomTeam(): PlayerSelection {
    // for (let i = 0; i < 6; i++) {
    //   const pokemon = this.generateRandomPokemon();
    // }

    return genericTeam;
  }

  private generateRandomPokemon() {
    return Math.floor(Math.random() * (this.MAX_POKEMON_RANGE - this.MIN_POKEMON_RANGE) + this.MAX_POKEMON_RANGE);
  }

  public selectAttackMove(): number {
    return Math.floor(Math.random() * 4);
  }

  public selectSwitchMove(): number {
    this.currentPokemonIndex += 1;
    return this.currentPokemonIndex;
  }
}
