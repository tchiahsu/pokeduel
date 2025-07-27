import BattleUtils from "./BattleUtils.js";
import Player from "./Player.js";
import Pokemon from "./Pokemon.js";
import PokemonFactory from "./PokemonFactory.js";
import pokemonData from "./pokemon.json" with {"type": "json"};
import StatusManager from "./StatusManager.js";

/**
 * An type representing a player's move.
 */
type PlayerMove = {
  action: string;
  index: number;
}

type TurnContext = {
    player1: Player;
    player2: Player;
    p1Move: PlayerMove;
    p2Move: PlayerMove;
  }

/**
 * A class representing the core logic of the pokemon battle system.
 */
export default class BattleModel {
  private player1ID: string;
  private player2ID: string;
  // Stores the messages displayed in turn summary
  private messages: string[] = [];
  // Temporary storage for messages generated during the current turn
  private turnSummary: string[] = [];
  // Stores functions that should be run after the attacks has been processed
  private endTurnEffects: (() => string | null)[] = [];
  private gameOver: boolean = false;
  private players: Record<string, Player> = {};
  private moves: Record<string, PlayerMove> = {};

  constructor() {
  }

  // /**
  //  * Sets player 1.
  //  * 
  //  * @param name The name of the player.
  //  * @param player1Team Contains the player's pokemon team selection.
  //  */
  // public setPlayer1(name: string, player1Team: string[]): void {
  //   const pokemonTeam: Pokemon[] = PokemonFactory.createTeam(player1Team);
  //   this.player1 = new Player(name, pokemonTeam);
  // }

  // /**
  //  * Sets player 2.
  //  * 
  //  * @param name The name of the player.
  //  * @param player2Team Contains the player's pokemon team selection.
  //  */
  // public setPlayer2(name: string, player2Team: string[]): void {
  //   const pokemonTeam: Pokemon[] = PokemonFactory.createTeam(player2Team);
  //   this.player2 = new Player(name, pokemonTeam);
  // }

  public async setPlayer(playerID: string, name: string, teamSelection: Record<string, string[]>): Promise<void> {
    if (!(playerID in this.players)) {
      const pokemonTeam: Pokemon[] = await PokemonFactory.createTeam(teamSelection);
      this.players[playerID] = new Player(name, pokemonTeam);
    }

    if (Object.keys(this.players).length === 1) {
      this.player1ID = playerID;
    } else {
      this.player2ID = playerID;
    }
  }

  public getPlayers(): Record<string, Player> {
    return this.players;
  }

  public getPlayer1ID(): string {
    return this.player1ID;
  }

  public getMoves(): Record<string, PlayerMove> {
    return this.moves;
  }

  public checkSetStatus() {
    return Object.keys(this.players);
  }

  public addMove(playerID: string, playerMove: PlayerMove): void {
    this.moves[playerID] = playerMove;
  }

  public readyToHandleTurn(): boolean {
    return Object.keys(this.moves).length === 2;
  }

  // /**
  //  * Handle's the actions for the players.
  //  * 
  //  * @param p1Move Player 1's move.
  //  * @param p2Move Player 2's move.
  //  */
  // public handleTurn(p1Move: PlayerMove, p2Move: PlayerMove): void {
  //   this.turnSummary = [];
    
  //   if (p1Move.action === "switch" && p2Move.action === "switch") {
  //     this.processSwitch(this.player1, p1Move.index);
  //     this.processSwitch(this.player2, p2Move.index);
  //   } else if (p1Move.action === "switch" && p2Move.action === "attack") {
  //     this.processSwitch(this.player1, p1Move.index);
  //     this.processAttack(this.player2, p2Move.index);
  //   } else if (p1Move.action === "attack" && p2Move.action === "switch") {
  //     this.processSwitch(this.player2, p2Move.index);
  //     this.processAttack(this.player1, p1Move.index);
  //   } else {
  //     this.handleAttack(p1Move, p2Move);
  //   }

  public getTurnContext(): TurnContext {
    return {
      player1: this.players[this.player1ID],
      player2: this.players[this.player2ID],
      p1Move: this.moves[this.player1ID],
      p2Move: this.moves[this.player2ID],
    }
  }

  /**
   * Handle's the actions for the players.
   * 
   * @param p1Move Player 1's move.
   * @param p2Move Player 2's move.
   */
  public handleTurn(): void {
    const {player1, player2, p1Move, p2Move} = this.getTurnContext();
    this.turnSummary = [];

    if (p1Move.action === "switch" && p2Move.action === "switch") {
      this.processSwitch(player1, p1Move.index);
      this.processSwitch(player2, p2Move.index);
    } else if (p1Move.action === "switch" || p2Move.action === "switch") {
      this.handleSingleSwitch();
    } else {
      this.handleAttack();
    }

    // This effects are collected in processAttack
    // Its meant to inflict effect damage after the attacks have been processed
    this.endTurnEffects.forEach(effect=> {
      const result = effect();
      if (result) this.turnSummary.push(result);
    });
    this.endTurnEffects = [];

    // Checks whether any of the pokemon has fainted after all moves and status effects
    // have been applied for the turn
    [player1, player2].forEach(player => {
      const currentPokemon = player.getCurrentPokemon();
      if (currentPokemon.getHp() <= 0 && player.hasRemainingPokemon()) {
        this.turnSummary.push(`${currentPokemon.getName()} has fainted!`);
        player.reduceRemainingPokemon();
        this.gameOver = !player.hasRemainingPokemon();
      }
    });

    this.moves = {};
    this.messages.push(...this.turnSummary);
  }
  
  public handleSingleSwitch() {
    const {player1, player2, p1Move, p2Move} = this.getTurnContext();
    const switchingPlayer = p1Move.action === "switch" ? player1 : player2;
    const switchingPlayerMove = switchingPlayer === player1 ? p1Move : p2Move;
    const attackingPlayer = switchingPlayer === player1 ? player2 : player1;
    const attackingPlayerMove = switchingPlayer === player1 ? p2Move : p1Move;

    this.processSwitch(switchingPlayer, switchingPlayerMove.index);
    this.processAttack(attackingPlayer, attackingPlayerMove.index);
  }

  /**
   * Handles the attack logic for battle.
   * 
   * @param p1Move Player 1's move.
   * @param p2Move Player 2's move.
   * @returns void
   */
  private handleAttack(): void {
    const {player1, player2, p1Move, p2Move} = this.getTurnContext();

    // Determine the order of attack
    const firstPlayer: Player = BattleUtils.getFasterPlayer(player1, player2);
    const firstPlayerMove: PlayerMove = firstPlayer === player1 ? p1Move : p2Move;
    const secondPlayer: Player = firstPlayer === player1 ? player2 : player1;
    const secondPlayerMove: PlayerMove = firstPlayer === player1 ? p2Move : p1Move;

    // Attack with the first player
    this.processAttack(firstPlayer, firstPlayerMove.index);
    if (BattleUtils.pokemonIsDefeated(secondPlayer)) {
      return;
    }

    // Attack with the second player if pokemon has not fainted
    this.processAttack(secondPlayer, secondPlayerMove.index);
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
    const {player1, player2} = this.getTurnContext();
    // Determine which player is attacking and defending
    const defendingPlayer: Player = attackingPlayer === player1 ? player2 : player1;
    const attackingPokemon: Pokemon = attackingPlayer.getCurrentPokemon();
    const defendingPokemon: Pokemon = defendingPlayer.getCurrentPokemon();
    const move = attackingPokemon.getMove(attackIndex);

    // Check whether the attacking pokemon is able to move this turn
    // Add the message associated to the effect that is applied
    const statusMessage = StatusManager.checkIfCanMove(attackingPokemon);
    if (statusMessage.message) {
      this.turnSummary.push(statusMessage.message);
    }

    // Add the message associated to the effect that happens at the end of the turn
    if (statusMessage.endTurnEffect) {
      this.endTurnEffects.push(statusMessage.endTurnEffect)
    }

    // If the effect prevents the pokemon from moving/attacking, then this skips the attack
    if (!statusMessage.canMove) {
      // Starts the fainting flow if the effect lowers pokemon HP to 0
      if (attackingPokemon.getHp() <= 0) {
        this.turnSummary.push(`${attackingPokemon.getName()} has fainted!`);
        attackingPlayer.reduceRemainingPokemon();
        this.gameOver = !attackingPlayer.hasRemainingPokemon();
      }
      // Return if the pokemon can't attack and hasn't fainted
      return;
    }

    // Add attack message from pokemon
    this.turnSummary.push(`${attackingPokemon.getName()} used ${move.getName()}!`)

    // Attack flow
    const damage: number = BattleUtils.calculateDamage(attackingPokemon, move, defendingPokemon);
    move.reducePP();
    defendingPokemon.takeDamage(damage);

    // Display pokemon HP after each attack
    const hp = defendingPokemon.getHp() < 0 ? 0 : defendingPokemon.getHp();
    this.turnSummary.push(`  >> ${defendingPokemon.getName()} took ${damage} damage! It has ${hp} hp left!`);

    // Display messages related to attack damage
    BattleUtils.getModiferMessages().forEach((modifierMessage: string) => this.turnSummary.push(modifierMessage));

    // New status effects may be inflicted based on the move used
    const effectMessage = StatusManager.tryApplyEffect(attackingPokemon, defendingPokemon, move);
    if (effectMessage) this.turnSummary.push(effectMessage)
    
    // Handle pokemon fainting
    if (BattleUtils.pokemonIsDefeated(defendingPlayer)) {
      this.turnSummary.push(`${defendingPokemon.getName()} has fainted!`);
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
    const {player1, player2, p1Move, p2Move} = this.getTurnContext();

    const player1Options: string = `${player1.getName()}'s options: \n` +
    `Attack with ${player1.getCurrentPokemon().getName()}: ${BattleUtils.getAllMoves(player1)}\n` +
    `Switch Pokemon: ${BattleUtils.getRemainingPokemon(player1)}\n`

    const player2Options: string = `${player2.getName()}'s options: \n` +
    `Attack with ${player2.getCurrentPokemon().getName()}: ${BattleUtils.getAllMoves(player2)}\n` +
    `Switch Pokemon: ${BattleUtils.getRemainingPokemon(player2)}\n`

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
    const {player1, player2} = this.getTurnContext();

    return BattleUtils.pokemonIsDefeated(player1) || BattleUtils.pokemonIsDefeated(player2);
  }

  /**
   * Returns the player's remaining pokemon.
   * 
   * @returns The player's remaining pokemon.
   */
  public getRemainingPokemon() {
    const {player1, player2} = this.getTurnContext();

    const faintedPlayer: Player = BattleUtils.pokemonIsDefeated(player1) ? player1 : player2;
    return `${faintedPlayer.getName()}'s Pokemons: ${BattleUtils.getRemainingPokemon(faintedPlayer)}`;
  }
  
  /**
   * Handles switching out a fainted pokemon and returns a message notifying the player has switched pokemon.
   * 
   * @param switchMove The player's move with the index of the pokemon to switch to.
   * @returns A message notifying the fainted player has switched pokemon.
   */
  public handleFaintedPokemon(switchMove: PlayerMove): string {
    const {player1, player2} = this.getTurnContext();

    const faintedPlayer: Player = BattleUtils.pokemonIsDefeated(player1) ? player1 : player2;
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
    const {player1, player2} = this.getTurnContext();

    const faintedPlayer: Player = player1.hasRemainingPokemon() ? player2 : player1;
    const otherPlayer: Player = faintedPlayer === player1 ? player2 : player1;
    
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
    const {player1, player2} = this.getTurnContext();

    if (BattleUtils.pokemonIsDefeated(player1)) return 1;
    if (BattleUtils.pokemonIsDefeated(player2)) return 2;
    throw new Error("No player has fainted.");
  }

  public getPlayerObject(playerNumber: number): Player {
    const {player1, player2} = this.getTurnContext();

    return playerNumber === 1 ? player1 : player2;
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
    const {player1, player2} = this.getTurnContext();

    const currentPlayer: Player = player === 1 ? player1 : player2;

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
}