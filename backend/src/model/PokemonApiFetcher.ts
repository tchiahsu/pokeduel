// Represents the common resource type in the Pokemon API
type NamedApiResource = {
  name: string;
  url: string;
};

// Represents the type for querying the default pokemon from the Pokemon API
type DefaultPokemonData = {
  results: NamedApiResource[];
};

// Represent the the type for querying a single default pokemon name and sprite from the Pokemon API
type DefaultPokemon = {
  name: string;
  sprite: string;
}

// Represents the type for fetching a single pokemon from the Pokemon API
type PokemonBaseData = {
  name: string;
  moves: PokemonBaseMovesData[];
  stats: PokemonBaseStatData[];
  types: PokemonTypeData[];
  sprites: Record<string, string>;
};

// Represents the type when accessing the "moves" field from the Pokemon Base Data in the Pokemon API
type PokemonBaseMovesData = {
  move: NamedApiResource;
};

// Represents the type when accessing the "stats" field from the Pokemon Base Data in the Pokemon API
type PokemonBaseStatData = {
  base_stat: number;
  stat: NamedApiResource;
};

// Represents the type when accessing the "types" field from the Pokemon Base Data in the Pokemon API
type PokemonTypeData = {
  type: NamedApiResource;
};

// Represents the type for fetching a move from the Pokemon API
type MoveBaseData = {
  name: string;
  type: NamedApiResource;
  damage_class: NamedApiResource; // category of the move
  power: number;
  accuracy: number;
  pp: number;
  meta: MovesBaseMetaData;
};

// Represents the type when accessing the "meta" field from the Move Base Data in the Pokemon API
type MovesBaseMetaData = {
  ailment: NamedApiResource;
  ailment_chance: number;
};

// Represents the type for a Pokemon object
type Pokemon = {
  name: string;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
  moves: string[];
  frontSprite: string;
  backSprite: string;
};

// Represents the keys within the Pokemon object
type StatKeys =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed";

// Represents the type of a Move object
type Move = {
  name: string;
  type: string;
  category: string;
  power: number;
  accuracy: number;
  pp: number;
  effect: string;
  effectChance: number;
};

// Represents the type for player's selection
type PlayerSelection = Record<string, string[]>;

// Represents the type for the pokemon data created from the Pokemon API
type PokemonData = Record<string, Pokemon>;

// Represents the type for the move data created from the Pokemon API
type MoveData = Record<string, Move>;

/**
 * A utility class for fetching Pokemon and move data from the Pokemon API (https://pokeapi.co/).
 *
 * Provides methods to:
 * - Get a list of default Pokemon
 * - Check if a given name is a valid Pokemon
 * - Get the list of moves for a given Pokemon
 * - Build structured Pokemon and move data used for a Pokemon battle
 */
export default class PokemonApiFetcher {
  /**
   * Fetches and returns an array containing the names and sprites of the default pokemon
   * from the Pokemon API.
   * The default pokemon are the first 151 pokemon in the game.
   *
   * @returns An array containing the names of the default pokemon.
   */
  static async getDefaultPokemon(): Promise<DefaultPokemon[]> {
    try {
      const response: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=151`
      );
      const defaultPokemonData: DefaultPokemonData = await response.json();

      const defaultPokemon: DefaultPokemon[] = [];

      for (const pokemon of defaultPokemonData.results) {
        const pokemonObj: Partial<DefaultPokemon> = {};
        pokemonObj.name = pokemon.name;

        const response: Response = await fetch(pokemon.url);
        const pokemonBaseData: PokemonBaseData = await response.json();
        pokemonObj.sprite = pokemonBaseData.sprites.front_default;

        defaultPokemon.push(pokemonObj as DefaultPokemon);
      }
      return defaultPokemon;
    } catch (error) {
      console.error(`Failed to fetch default pokemon`, error);
      return [] as DefaultPokemon[];
    }
  }

  /**
   * Checks if a given string representing the name of a pokemon is actually
   * a pokemon.
   *
   * @param pokemonName The name of the Pokemon.
   * @returns True if the string is a Pokemon, false otherwise.
   */
  static async isPokemon(pokemonName: string): Promise<boolean> {
    try {
      const response: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      return response.status === 404 ? false : true;
    } catch (error) {
      console.error(`Failed to search if "${pokemonName}" is a pokemon`, error);
      return false;
    }
  }

  /**
   * Fetches and returns an array containing all of the possible moves for a given Pokemon.
   *
   * @param pokemonName The Pokemon to get the moves for.
   * @returns An array containing all of the possible moves for a given Pokemon.
   */
  static async getPokemonMoves(pokemonName: string): Promise<string[]> {
    try {
      const response: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const pokemonBaseData: PokemonBaseData = await response.json();
      return pokemonBaseData.moves.map(
        (moveObject: PokemonBaseMovesData) => moveObject.move.name
      );
    } catch (error) {
      console.error(`Failed to fetch the moves for "${pokemonName}"`, error);
      return [];
    }
  }

  /**
   * Builds and returns full Pokémon data (stats, types, moves, sprites)
   * for all Pokémon in the player's selection.
   * Pokemon data is a collection of Pokemon by their names as a key and the
   * corresponding Pokemon object as a value.
   *
   * @param playerSelection The player's selection of Pokemon and their moves.
   * @returns The Pokemon data to be used in the pokemon battle.
   */
  static async createFullPokemonData(
    playerSelection: PlayerSelection
  ): Promise<PokemonData> {
    const pokemonData: PokemonData = {};
    for (const [pokemonName, pokemonMoves] of Object.entries(playerSelection)) {
      pokemonData[pokemonName] = await PokemonApiFetcher.createOnePokemonData(
        pokemonName,
        pokemonMoves
      );
    }
    return pokemonData;
  }

  /**
   * Fetches and constructs a single Pokémon object with name, types, stats,
   * selected moves, and front/back sprites.
   *
   * @param pokemonName The name of the Pokemon.
   * @param pokemonMoves The moves selected for the Pokemon.
   * @returns A single Pokémon object.
   */
  static async createOnePokemonData(
    pokemonName: string,
    pokemonMoves: string[]
  ): Promise<Pokemon> {
    try {
      const response: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const pokemonBaseData: PokemonBaseData = await response.json();
      const pokemon: Partial<Pokemon> = {
        name: pokemonBaseData.name,
        types: pokemonBaseData.types.map(
          (typeData: PokemonTypeData) => typeData.type.name
        ),
        moves: pokemonMoves,
        frontSprite: pokemonBaseData.sprites.front_default,
        backSprite: pokemonBaseData.sprites.back_default,
      };

      pokemonBaseData.stats.forEach((pokemonStat: PokemonBaseStatData) => {
        const statName = pokemonStat.stat.name as StatKeys;
        pokemon[statName] = pokemonStat.base_stat;
      });
      return pokemon as Pokemon;
    } catch (error) {
      console.error(
        `Failed to fetch and create the pokemon data for "${pokemonName}"`,
        error
      );
      return {} as Pokemon;
    }
  }

  /**
   * Builds and returns full move data (name, power, pp, types, etc.)
   * for all the moves in the player's selection.
   * Move data is a collection of Moves by their names as a key and the
   * corresponding Move object as a value.
   *
   * @param playerSelection The player's selection of Pokemon and their moves.
   * @returns The move data to be used in the Pokemon battle.
   */
  static async createFullMoveData(
    playerSelection: PlayerSelection
  ): Promise<MoveData> {
    const moveNames: string[] = [];
    for (const pokemonMoves of Object.values(playerSelection)) {
      for (const moveName of pokemonMoves) {
        if (!moveNames.includes(moveName)) {
          moveNames.push(moveName);
        }
      }
    }

    const moveData: MoveData = {};

    for (const moveName of moveNames) {
      moveData[moveName] = await PokemonApiFetcher.createOneMoveData(moveName);
    }

    return moveData;
  }

  /**
   * Fetches and constructs a Move object with name, type, category,
   * power, accuracy, PP, effect name, and effect chance.
   *
   * @param moveName The name of the move.
   * @returns A single Move object.
   */
  static async createOneMoveData(moveName: string): Promise<Move> {
    try {
      const response: Response = await fetch(
        `https://pokeapi.co/api/v2/move/${moveName}`
      );
      const moveBaseData: MoveBaseData = await response.json();
      const move: Move = {
        name: moveBaseData.name,
        type: moveBaseData.type.name,
        category: moveBaseData.damage_class.name,
        power: moveBaseData.power,
        accuracy: moveBaseData.accuracy,
        pp: moveBaseData.pp,
        effect: moveBaseData.meta.ailment.name,
        effectChance: moveBaseData.meta.ailment_chance,
      };

      return move;
    } catch (error) {
      console.error(
        `Failed to fetch and create the move data for "${moveName}"`,
        error
      );
      return {} as Move;
    }
  }
}