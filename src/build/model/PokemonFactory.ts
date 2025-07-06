import Pokemon from "./Pokemon.js";
import Move from "./Move.js";
import pokemonData from "./pokemon.json" with { "type": "json"};
import moveData from "./moves.json" with {"type": "json"};

/**
 * Class for creating a team of Pokemon from just their name.
 */
export default class PokemonFactory {

  /**
   * Creates a team of Pokemon objects from an array of Pokemon names.
   * @param pokemonNames an array of strings representing the names of the Pokemon to create.
   * @returns an array of Pokemon objects.
   */
  static createTeam(pokemonNames: string[]) {
    let team = pokemonNames.map((pokemonName) => this.createPokemon(pokemonName));
    return team;
  }

  /**
   * Creates a single Pokemon object from its name by retrieving its stats and moves from the dataset.
   * @param pokemonName the name of the Pokemon to create.
   * @returns a Pokemon object with stats and moves initialized.
   */
  static createPokemon(pokemonName: string) {
    const data = pokemonData[pokemonName as keyof typeof pokemonData]
    const moves = data.moves.map((moveName: string) => this.createMove(moveName));
    let pokemon = new Pokemon(
      data.name, 
      data.types, 
      data.hp, 
      data.attack, 
      data.defense, 
      data.spAtk, 
      data.spDef, 
      data.speed, 
      moves // Move[]
    );
    return pokemon;
  }

  /**
   * Creates a Move object from its name by retrieving its details from the move dataset.
   * @param currentMove the name of the move to create.
   * @returns a Move object with its properties initialized.
   */
  static createMove(currentMove: string) {
    const data = moveData[currentMove as keyof typeof moveData];
    let move = new Move(data.type, data.category, data.power, data.accuracy, data.pp);
    return move;
  }
}

// For testing
// let pf = new PokemonFactory();
// let team = pf.createTeam(["Venusaur", "Charizard", "Blastoise", "Alakazam", "Machamp", "Gengar"]);
// console.log(team);

// console.log(`Blastoise moves: ${team[2].raiseStat("atk", 7)}`);
// team[2].takeDamage(9);
// console.log(`Blastoise health: ${team[2].getHp()}`);