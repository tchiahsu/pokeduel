import Pokemon from "./Pokemon.js";
import pokemonData from "./pokemon.json" with { "type": "json"};

/**
 * A class for creating a team of Pokemon from just their name.
 */
class PokemonFactory {

  createTeam(pokemonNames) {
    let team = pokemonNames.map((pokemonName) => this.createPokemon(pokemonName));
    return team;
  }

  createPokemon(pokemonName) {
    let pokemon = new Pokemon(pokemonData[pokemonName]);
    return pokemon;
  }
}

// For testing
let pf = new PokemonFactory();
let team = pf.createTeam(["Venusaur", "Charizard", "Blastoise", "Alakazam", "Machamp", "Gengar"]);
console.log(team);

console.log(`Blastoise health: ${team[2].getStat("hp")}`);
team[2].takeDamage(9);
console.log(`Blastoise health: ${team[2].getStat("hp")}`);