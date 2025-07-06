import Pokemon from "./Pokemon.js";
import Player from "./Player.js";
import Move from "./Move.js";

export default class BattleUtils {
  static getFasterPlayer(player1: Player, player2: Player): Player {
    let player1Speed: number = player1.getCurrentPokemon().getSpeed();
    let player2Speed: number = player2.getCurrentPokemon().getSpeed();

    if (player1Speed === player2Speed) {
      return Math.random() < 0.5 ? player1 : player2;
    }

    return player1Speed > player1Speed ? player1 : player2;
  }
  
  static pokemonIsDefeated(player: Player): boolean {
    return player.getCurrentPokemon().getHp() <= 0;
  }

  static getAllMoves(player: Player): string {
    return player.getCurrentPokemon().getMoves().map((move: Move) => move.getName()).join(", ");
  }

  static getRemainingPokemon(player: Player): string {
    return player.getTeam().filter((pokemon: Pokemon) => pokemon.getHp() > 0)
                           .map((pokemon: Pokemon) => pokemon.getName())
                           .join(", ");
  }

  static calculateDamage(attacker: Pokemon, attackIndex: number, defender: Pokemon): number {
    let attackPower: number = attacker.getMove(attackIndex).getPower();
    let stab: boolean = attacker.getTypes().some((type: string) => attacker.getMove(attackIndex).getType().includes(type));
    attackPower = stab ? (attackPower * 1.3) : attackPower;
    return attackPower;
  }
}