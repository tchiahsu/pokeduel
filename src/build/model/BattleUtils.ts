import Pokemon from "./Pokemon.js";
import Player from "./Player.js";
import Move from "./Move.js";

/**
 * A utility class providing helper functions for managing 
 * battle-related logic between players and their Pokemon.
 */
export default class BattleUtils {

  /**
   * Determines which player’s Pokemon is affected.
   * If both have the same speed, one is randomly chosen.
   *
   * @param player1 first player in the battle.
   * @param player2 second player in the battle.
   * @returns the player with the faster current Pokémon.
   */
  static getFasterPlayer(player1: Player, player2: Player): Player {
    const player1Speed: number = player1.getCurrentPokemon().getSpeed();
    const player2Speed: number = player2.getCurrentPokemon().getSpeed();

    if (player1Speed === player2Speed) {
      return Math.random() < 0.5 ? player1 : player2;
    }

    return player1Speed > player1Speed ? player1 : player2;
  }
  
  /**
   * Checks if a player's current Pokémon has been defeated (HP ≤ 0).
   *
   * @param player the player whose Pokémon is being checked.
   * @returns true if the Pokémon has 0 or less HP, otherwise false.
   */
  static pokemonIsDefeated(player: Player): boolean {
    return player.getCurrentPokemon().getHp() <= 0;
  }

  /**
   * Gets a comma-separated string of all move names
   * for the current Pokemon of the given player.
   *
   * @param player the player whose Pokemon's moves are being listed.
   * @returns a string of move names.
   */
  static getAllMoves(player: Player): string {
    return player.getCurrentPokemon().getMoves().map((move: Move) => move.getName()).join(", ");
  }
  
  /**
   * Gets the remaining pokemon names of the player that is passed in.
   * @param player whose remaining pokemon are returned
   * @returns the remaining pokemon of the player
   */
  static getRemainingPokemon(player: Player): string {
    // const currentIndex = player.getCurrentPokemonIndex();

    // return player.getTeam().filter((pokemon: Pokemon, idx: number) => idx !== currentIndex && pokemon.getHp() > 0)
    //                        .map((pokemon: Pokemon) => pokemon.getName())
    //                        .join(", ");
    return player.getTeam().map((pokemon: Pokemon) => pokemon.getName()).join(", ");
  }

  /**
   * Calculates the damage dealt by the attacker's selected move
   * to a defending Pokemon. Applies STAB (Same Type Attack Bonus)
   * if the move's type matches one of the attacker's types.
   *
   * @param attacker the attacking Pokemon.
   * @param attackIndex index of the move to be used by the attacker.
   * @param defender the defending Pokémon.
   * @returns the calculated damage as a number.
   */
  static calculateDamage(attacker: Pokemon, attackIndex: number, defender: Pokemon): number {
    let attackPower: number = attacker.getMove(attackIndex).getPower();
    const stab: boolean = attacker.getTypes().some((type: string) => attacker.getMove(attackIndex).getType().includes(type));
    attackPower = stab ? (attackPower * 1.3) : attackPower;
    return attackPower;
  }
}