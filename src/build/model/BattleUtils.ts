import Pokemon from "./Pokemon.js";
import Player from "./Player.js";
import Move from "./Move.js";
import typeEffectivenessData from "./TypeEffectiveness.json" with {"type": "json"};

/**
 * A utility class providing helper functions for managing 
 * battle-related logic between players and their Pokemon.
 */
export default class BattleUtils {
  private static CRIT_CHANCE: number = 0.00417;
  private static STAB_MODIFIER: number = 1.5;
  private static CRIT_MODIFIER: number = 1.5;
  private static RANDOM_MODIFIER_UPPER_BOUND: number = 101;
  private static RANDOM_MODIFIER_LOWER_BOUND: number = 85;
  private static modifierMessages: string[];

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
   * Calculates the damage dealt by the attacking pokemon's selected move
   * to a defending pokemon.
   *
   * @param attacker the attacking Pokemon.
   * @param attackIndex index of the move to be used by the attacker.
   * @param defender the defending Pokémon.
   * @returns the calculated damage as a number.
   */
  static calculateDamage(attacker: Pokemon, move: Move, defender: Pokemon): number {
    const attackType: string = move.getCategory();
    const attackerPower: number = attackType === "physical" ? attacker.getAtk() : attacker.getSpAtk();
    const defenderDefense: number = attackType === "physical" ? defender.getDef() : defender.getSpDef();
    const movePower = move.getPower();

    const criticalModifer: number = this.getCriticalModifier();
    const typeEffectivenessModifier: number = this.getTypeEffectivenessModifier(move, defender);
    const stabModifier: number = this.getStabModifier(attacker, move);
    const randomModifier: number = this.getRandomModifier();

    const modifierProduct = criticalModifer * typeEffectivenessModifier * stabModifier * randomModifier;
    const damage: number = Math.round((((attackerPower * movePower) / (defenderDefense * 50)) + 2) * modifierProduct);
    
    return damage;
  }

  /**
   * Calculate the damage modifier for type effectiveness.
   * 
   * @param move The move being used to attack. The attack type will be extracted from this.
   * @param defender The defending pokemon. The defending types will be extracted from this.
   * @returns a number representing the type effectiveness modifier.
   */
  private static getTypeEffectivenessModifier(move: Move, defender: Pokemon): number {
    const typeData: any = typeEffectivenessData[move.getType() as keyof typeof typeEffectivenessData]
    // defender.getTypes().forEach((type: string) => {
    //   if (type in typeData) {
    //     modifier *= typeData[type];
    //   }
    // })

    const modifier = defender.getTypes().reduce((accumulator: number, type: string) => {
      if (type in typeData) {
        return accumulator * typeData[type]
      }
      return 1
    }, 1)

    return modifier;
  }

  /**
   * Returns the STAB (same-type attack bonus) modifier if it applies, 1 otherwise.
   * 
   * @param attacker The attacking pokemon.
   * @param move The move used by the attacking pokemon.
   * @returns The STAB modifier if it applies, 1 otherwise.
   */
  private static getStabModifier(attacker: Pokemon, move: Move): number {
    return attacker.getTypes().some((type: string) => move.getType().includes(type)) ? this.STAB_MODIFIER : 1;
  }

  /**
   * Returns the critical modifier if it applies, 1 otherwise.
   * 
   * @returns The critical modifier if it applies, 1 otherwise.
   */
  private static getCriticalModifier(): number {
    return Math.random() <= this.CRIT_CHANCE ? this.CRIT_MODIFIER : 1
  }

  /**
   * Returns the random modifier.
   * 
   * @returns The random modifier.
   */
  private static getRandomModifier(): number {
    const numerator: number = Math.random() * 
      (this.RANDOM_MODIFIER_UPPER_BOUND - this.RANDOM_MODIFIER_LOWER_BOUND) + this.RANDOM_MODIFIER_LOWER_BOUND;
    
      return numerator / 100;
  }
}