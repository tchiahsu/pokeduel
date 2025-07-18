import BattleUtils from "./BattleUtils.js";
import Player from "./Player.js";
import Pokemon from "./Pokemon.js";
import PokemonFactory from "./PokemonFactory.js";
import pokemonData from "./pokemon.json" with {"type": "json"};
import StatusManager from "./StatusManager.js";

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
export default class BattleModel {
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
    const pokemonTeam: Pokemon[] = PokemonFactory.createTeam(player1Team);
    this.player1 = new Player(name, pokemonTeam);
  }

  /**
   * Sets player 2.
   * 
   * @param name The name of the player.
   * @param player2Team Contains the player's pokemon team selection.
   */
  public setPlayer2(name: string, player2Team: string[]): void {
    const pokemonTeam: Pokemon[] = PokemonFactory.createTeam(player2Team);
    this.player2 = new Player(name, pokemonTeam);
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
    // Display message about pokemon effect status
    const p1EffectStatus = StatusManager.checkIfCanMove(this.player1.getCurrentPokemon());
    if (p1EffectStatus) this.messages.push(p1EffectStatus);

    const p2EffectStatus = StatusManager.checkIfCanMove(this.player2.getCurrentPokemon());
    if (p2EffectStatus) this.messages.push(p2EffectStatus);

    // Determine the order of attack
    const firstPlayer: Player = BattleUtils.getFasterPlayer(this.player1, this.player2);
    const firstPlayerMove: PlayerMove = firstPlayer === this.player1 ? p1Move : p2Move;
    const secondPlayer: Player = firstPlayer === this.player1 ? this.player2 : this.player1;
    const secondPlayerMove: PlayerMove = firstPlayer === this.player1 ? p2Move : p1Move;

    // Attack with the first player
    this.processAttack(firstPlayer, firstPlayerMove.index);
    if (BattleUtils.pokemonIsDefeated(secondPlayer)) {
      return;
    }

    // Attack with the second player if pokemon has not fainted
    this.processAttack(secondPlayer, secondPlayerMove.index);
  }
  
  /**
   * Checks if the player's move is invalid.
   * A move is invalid if the player tries to switch to their currently active Pokémon.
   * 
   * @param player The player number (1 or 2).
   * @param playerMove The move the player wants to make.
   * @returns True if the move is invalid, false otherwise.
   */
  public isInvalidMove(player: number, playerMove: PlayerMove): boolean {
    const currentPlayer: Player = player === 1 ? this.player1 : this.player2;

    if (playerMove.action === 'switch') {
      return playerMove.index === currentPlayer.getCurrentPokemonIndex();
    }

    if (playerMove.action === 'attack') {
      const move = currentPlayer.getCurrentPokemon().getMove(playerMove.index);
      return move.getPP() === 0;
    }

    return false;
  }

  /**
   * Check the user inputs a valid action
   * 
   * @param action The action selected by the user.
   */
  public isInvalidAction(action: string): boolean {
    return !(action === 'attack' || action === 'switch')
  }

  /**
   * Check the pokemons the user has selected are valid
   * 
   * @param team A list of pokemons in a player's team
   * @param allPokemon A list of all pokemons in the game
   */
  public isInvalidPokemon(team: string[], allPokemon: string): boolean {
    // convert allPokemon into an array of pokemon names
    const allPokemonArray = allPokemon.split(/\s+/).map(name => name.trim());

    for (let pokemon of team) {
      if (!allPokemonArray.includes(pokemon)) {
        return true
      }
    }
    return false
  }

  /**
   * Check the given action argument is valid.
   * For attack - make sure the argument is within indexes 1-4
   * For switch - make sure the argument is valid for the team size
   * 
   * @param action The action selected by the user
   * @param argument The index for the action the user want to perform
   * @param team A list of pokemons in a player's team
   */
  public isInvalidIndex(action: string, argument: number, team: string[], ): boolean {
    if (action === 'attack') {
      return !(argument >= 1 && argument <= 4)
    } else {
      const teamLength = team.length
      return !(argument >= 1 && argument <= teamLength)
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
    this.messages.push(`${player.getName()} switched to ${player.getCurrentPokemon().getName()}!`);
  }
  
  /**
   * Handles an attack from a pokemon.
   * 
   * @param attackingPlayer The attack player.
   * @param attackIndex The index of the move the player wants to use.
   * @returns void
   */
  private processAttack(attackingPlayer: Player, attackIndex: number): void {
    // Determine which player is attacking and defending
    const defendingPlayer: Player = attackingPlayer === this.player1 ? this.player2 : this.player1;
    const attackingPokemon: Pokemon = attackingPlayer.getCurrentPokemon();
    const defendingPokemon: Pokemon = defendingPlayer.getCurrentPokemon();
    const move = attackingPokemon.getMove(attackIndex);

    // Check if attacking pokemon is blocked by status
    const statusMessage = StatusManager.checkIfCanMove(attackingPokemon);
    if (statusMessage) {
      this.messages.push(statusMessage);

      if (attackingPokemon.getHp() <= 0) {
        this.messages.push(`${attackingPokemon.getName()} has fainted!`);
        attackingPlayer.reduceRemainingPokemon();
        this.gameOver = !attackingPlayer.hasRemainingPokemon();
        return;
      }
      // If the status prevents ur pokemon from making a move, it returns
      return;
    }

    // Proceed with attack
    const damage: number = BattleUtils.calculateDamage(attackingPokemon, move, defendingPokemon);
    move.reducePP();
    defendingPokemon.takeDamage(damage);
    this.messages.push(`${attackingPokemon.getName()} used ${move.getName()}!`);

    // Display messages related to attack damage
    BattleUtils.getModiferMessages().forEach((modifierMessage: string) => this.messages.push(modifierMessage));

    // Try to apply effect
    const effectMessage = StatusManager.tryApplyEffect(attackingPokemon, defendingPokemon, move);
    if (effectMessage) this.messages.push(effectMessage)
    
    // Handle pokemon fainting
    if (BattleUtils.pokemonIsDefeated(defendingPlayer)) {
      this.messages.push(`${defendingPokemon.getName()} has fainted!`);
      defendingPlayer.reduceRemainingPokemon();
      this.gameOver = defendingPlayer.hasRemainingPokemon() ? false : true;
    }
  }

  /**
   * Returns the available options for the players.
   * 
   * @returns The available options for the players.
   */
  public getPlayerOptions(): string[] {
    const player1Options: string = `${this.player1.getName()}'s options: \n` +
    `Attack with ${this.player1.getCurrentPokemon().getName()}: ${BattleUtils.getAllMoves(this.player1)}\n` +
    `Switch Pokemon: ${BattleUtils.getRemainingPokemon(this.player1)}\n`

    const player2Options: string = `${this.player2.getName()}'s options: \n` +
    `Attack with ${this.player2.getCurrentPokemon().getName()}: ${BattleUtils.getAllMoves(this.player2)}\n` +
    `Switch Pokemon: ${BattleUtils.getRemainingPokemon(this.player2)}\n`

    return [player1Options, player2Options];
  }

  /**
   * Returns the messages representing what happened in this turn.
   * 
   * @returns The messages representing what happened in this turn.
   */
  public getMessages(): string[] {
    const messages: string[] = [...this.messages, ""];
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
    const faintedPlayer: Player = BattleUtils.pokemonIsDefeated(this.player1) ? this.player1 : this.player2;
    return `${faintedPlayer.getName()}'s Pokemons: ${BattleUtils.getRemainingPokemon(faintedPlayer)}`;
  }
  
  /**
   * Handles switching out a fainted pokemon and returns a message notifying the player has switched pokemon.
   * 
   * @param switchMove The player's move with the index of the pokemon to switch to.
   * @returns A message notifying the fainted player has switched pokemon.
   */
  public handleFaintedPokemon(switchMove: PlayerMove): string {
    const faintedPlayer: Player = BattleUtils.pokemonIsDefeated(this.player1) ? this.player1 : this.player2;
    //faintedPlayer.updateTeam(faintedPlayer.getCurrentPokemonIndex());
    faintedPlayer.switchPokemon(switchMove.index);
    return `${faintedPlayer.getName()} switched to ${faintedPlayer.getCurrentPokemon().getName()}!\n`;
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
    const faintedPlayer: Player = this.player1.hasRemainingPokemon() ? this.player2 : this.player1;
    const otherPlayer: Player = faintedPlayer === this.player1 ? this.player2 : this.player1;
    
    return `${faintedPlayer.getName()} is out of Pokemon! ${otherPlayer.getName()} wins!`
  }

  /**
   * Returns all the pokemon that can be used in the game.
   * 
   * @returns All the pokemon that can be used in the game.
   */
  public getAllPokemon(): string {
    let allPokemon: string = "";

    Object.keys(pokemonData).forEach((key, index) => {
      allPokemon += key + " ";
      if ((index + 1) % 5 === 0) {
        allPokemon += "\n";
      }
    });
    return allPokemon;
  }

  /**
   * Determine which player's pokemon has fainted
   */
  public getFaintedPlayer(): number {
    if (BattleUtils.pokemonIsDefeated(this.player1)) return 1;
    if (BattleUtils.pokemonIsDefeated(this.player2)) return 2;
    throw new Error("No player has fainted.");
  }

  public getPlayerObject(playerNumber: number): Player {
    return playerNumber === 1 ? this.player1 : this.player2;
  }
}