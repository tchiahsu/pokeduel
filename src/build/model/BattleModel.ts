import BattleUtils from "./BattleUtils";


/**
 * An interface representing the player's move.
 */
interface PlayerMove {
  action: string;
  index: number;
}

/**
 * A class representing the core logic of the pokemon battle system.
 */
class BattleModel {
  private player1: Player;
  private player2: Player;
  private messages: string[] = [];
  private gameOver: boolean = false;

  constructor() {
  }

  /**
   * Sets player 1.
   * 
   * @param name The name of the player.
   * @param player1Team Contains the player's pokemon team selection.
   */
  public setPlayer1(name: string, player1Team: string[]): void {
    player1Team = PokemonFactory.createTeam(player1Team);
    this.player1 = new Player(name, player1Team);
  }

  /**
   * Sets player 2.
   * 
   * @param name The name of the player.
   * @param player2Team Contains the player's pokemon team selection.
   */
  public setPlayer2(name: string, player2Team: string[]): void {
    player2Team = PokemonFactory.createTeam(player2Team);
    this.player2 = new Player(name, player2Team);
  }

  /**
   * Handle's the actions for the players.
   * 
   * @param p1Move Player 1's move.
   * @param p2Move Player 2's move.
   */
  public handleTurn(p1Move: PlayerMove, p2Move: PlayerMove): void {
    if (p1Move.action === "switch" && p2Move.action === "switch") {
      this.processSwitch(this.player1, p1Move.index);
      this.processSwitch(this.player2, p2Move.index);
    } else if (p1Move.action === "switch" && p2Move.action === "attack") {
      this.processSwitch(this.player1, p1Move.index);
      this.processAttack(this.player2, p2Move.index);
    } else if (p1Move.action === "attack" && p2Move.action === "switch") {
      this.processSwitch(this.player2, p2Move.index);
      this.processAttack(this.player1, p1Move.index);
    } else {
      this.handleAttack(p1Move, p2Move);
    }
  }
  
  /**
   * Handles the attack logic for battle.
   * 
   * @param p1Move Player 1's move.
   * @param p2Move Player 2's move.
   * @returns void
   */
  private handleAttack(p1Move: PlayerMove, p2Move: PlayerMove): void {
    let firstPlayer: Player = BattleUtils.getFasterPlayer(this.player1, this.player2);
    let firstPlayerMove: PlayerMove = firstPlayer === this.player1 ? p1Move : p2Move;
    let secondPlayer: Player = firstPlayer === this.player1 ? this.player2 : this.player1;
    let secondPlayerMove: PlayerMove = firstPlayer === this.player1 ? p2Move : p1Move;

    this.processAttack(firstPlayer, firstPlayerMove.index);
    if (BattleUtils.pokemonIsDefeated(secondPlayer)) {
      this.messages.push(`${secondPlayer.getCurrentPokemon().getName()} has fainted!\n`);
      this.gameOver = secondPlayer.hasRemainingPokemon() ? false : true;
      return;
    }

    this.processAttack(secondPlayer, secondPlayerMove.index);
    if (BattleUtils.pokemonIsDefeated(firstPlayer)) {
      this.messages.push(`${firstPlayer.getCurrentPokemon().getName()} has fainted!\n`);
      this.gameOver = firstPlayer.hasRemainingPokemon() ? false : true;
      return;
    }
  }
  
  /**
   * Handles switching pokemon for the player.
   * 
   * @param player The player that wants to switch pokemon.
   * @param pokemonIndex The index of the pokemon to switch to.
   */
  private processSwitch(player: Player, pokemonIndex: number): void {
    player.switchPokemon(pokemonIndex);
    this.messages.push(`${player.getName()} switched to ${player.getCurrentPokemon()}!\n`);
  }
  
  private processAttack(player: Player, attackIndex: number): void {

  }

  /**
   * Returns the available options for the players.
   * 
   * @returns The available options for the players.
   */
  public getPlayerOptions(): string[] {
    let player1Options: string = `${this.player1.getName()} options: \n
    ${this.player1.getCurrentPokemon().getName()} Attack: ${BattleUtils.getAllMoves(this.player1)}\n
    Switch Pokemon: ${BattleUtils.getRemainingPokemon(this.player1)}\n\n`

    let player2Options: string = `${this.player2.getName()} options: \n
    ${this.player2.getCurrentPokemon().getName()} Attack: ${BattleUtils.getAllMoves(this.player2)}\n
    Switch Pokemon: ${BattleUtils.getRemainingPokemon(this.player2)}\n\n`

    return [player1Options, player2Options];
  }

  /**
   * Returns the messages representing what happened in this turn.
   * 
   * @returns The messages representing what happened in this turn.
   */
  public getMessages(): string[] {
    let messages: string[] = [...this.messages];
    this.messages = [];
    return messages;
  }

  /**
   * Returns whether one of the current pokemon has fainted.
   * 
   * @returns Whether one of the current pokemon has fainted.
   */
  public aPokemonHasFainted(): boolean {
    return BattleUtils.pokemonIsDefeated(this.player1) || BattleUtils.pokemonIsDefeated(this.player2);
  }

  /**
   * Returns the player's remaining pokemon.
   * 
   * @returns The player's remaining pokemon.
   */
  public getRemainingPokemon() {
    let faintedPlayer: Player = BattleUtils.pokemonIsDefeated(this.player1) ? this.player1 : this.player2;
    return `${faintedPlayer.getName()} remaining Pokemon: ${BattleUtils.getRemainingPokemon(faintedPlayer)}\n`;
  }
  
  /**
   * Handles switching out a fainted pokemon and returns a message notifying the player has switched pokemon.
   * 
   * @param switchMove The player's move with the index of the pokemon to switch to.
   * @returns A message notifying the fainted player has switched pokemon.
   */
  public handleFaintedPokemon(switchMove: PlayerMove): string {
    let faintedPlayer: Player = BattleUtils.pokemonIsDefeated(this.player1) ? this.player1 : this.player2;
    faintedPlayer.switchPokemon(switchMove.index);
    return `${faintedPlayer.getName()} switched to ${faintedPlayer.getCurrentPokemon()}!\n`;
  }
  
  /**
   * Returns a boolean indicating whether the game is over or not.
   * 
   * @returns A boolean indicating whether the game is over or not.
   */
  public isGameOver(): boolean {
    return this.gameOver;
  }
  
  /**
   * Returns the game's ending message with the winner.
   * 
   * @returns The game's ending message with the winner.
   */
  public getEndingMessage(): string {
    let faintedPlayer: Player = this.player1.hasRemainingPokemon() ? this.player2 : this.player1;
    let otherPlayer: Player = faintedPlayer === this.player1 ? this.player2 : this.player1;
    
    return `${faintedPlayer} is out of Pokemon! ${otherPlayer} wins!\n`
  }
}