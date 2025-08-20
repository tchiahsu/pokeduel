/**
 * Defines the structure of a Pokemon object
 * - name: the name of the pokemon
 * - sprite: the URL path to the pokemon image
 */
export type Pokemon = {
    name: string;
    sprite: string;
};

/**
 * Defines the structure of a Pokemon to add to a team
 * - pokemon: name of the pokemon
 * - moves: list of 4 moves for the pokemon
 */
export type TeamEntry = {
    pokemon: string;
    moves: string[];
}