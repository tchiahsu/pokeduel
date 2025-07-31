// Represents the type for a Pokemon object
export type PokemonType = {
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

// Represents the type of a Move object
export type MoveType = {
  name: string;
  type: string;
  category: string;
  power: number;
  accuracy: number;
  pp: number;
  effect: string;
  effectChance: number;
};
