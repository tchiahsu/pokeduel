import BattleUtils from "./BattleUtils.js";
import Player from "./Player.js";
import Pokemon from "./Pokemon.js";
import PokemonFactory from "./PokemonFactory.js";
import StatusManager from "./StatusManager.js";
import BotPlayer from "./BotPlayer.js";

/**
 * A type representing a player's move.
 */
type PlayerMove = {
  action: string;
  index: number;
};

/**
 * A type representing an effect that triggers at the end of a turn.
 */
type EndTurnEffect = {
  player: string;
  effect: () => string | null;
};

/**
 * A type representing an event in the battle (attack, switch, faint, or status effect).
 * Used to animate battle actions and display messages to the players.
 */
type Event = {
  user: string; // "self" | "opponent"
  animation: string; // "attack" | "switch" | "status" | "faint" | "none"
  message: string;
  type: string;
  image: string;
  name: string;
  pokemon?: Pokemon;
};

/**
 * A type representing the set of possible actions a player can take on their next turn.
 */
type NextOptions = {
  moves: MoveOptions[];
  pokemon: PokemonOptions[];
};

/**
 * A type representing the basic move information of the current Pokemon available to a player.
 * Used for displaying move options in NextOptions.
 */
type MoveOptions = {
  name: string;
  type: string;
  pp: number;
  maxPP: number;
};

/**
 * A type representing the basic information of a Pokemon available to a player.
 * Used for displaying switch options in NextOptions.
 */
type PokemonOptions = {
  name: string;
  hp: number;
  maxHP: number;
  sprite: string;
};

/**
 * A type representing the overall state of the battle visible to a player.
 */
type CurrentState = {
  self: PlayerState;
  opponent: PlayerState;
};

/**
 * A type representing exact state of a player.
 */
type PlayerState = {
  name: string;
  hp: number;
  maxHP: number;
  sprite: string;
  remainingPokemon: number;
  teamCount: number;
};

/**
 * A class representing the core logic of the Pokemon battle system.
 * Handles player setup, move registration, turn resolution state, and battle events.
 */
export default class BattleModel {
  // The IDs of the players (their socket IDs)
  private player1ID: string;
  private player2ID: string;
  // Maps the IDs of the players to their in-game Player
  private players: Record<string, Player> = {};
  // Maps the IDs of the players to their moves
  private moves: Record<string, PlayerMove> = {};
  // Effects that should trigger at the end of a turn
  private endTurnEffects: EndTurnEffect[] = [];
  // Indicates whether the battle has concluded
  private gameOver: boolean = false;
  // A log of events that occurred during a turn
  private events: Event[] = [];
  // Utility functions and helpers for battle mechanics
  private battleUtils: BattleUtils = new BattleUtils();
  // List of player IDs whose active Pokemon have fainted this turn
  private faintedPlayers: string[] = [];
  // Reference to the bot player instance (used if playing against AI)
  private botPlayer: BotPlayer;

  /** Returns the ID of player 1.
   *
   * @returns The ID of player 1.
   */
  public getPlayer1ID() {
    return this.player1ID;
  }

  /** Returns the ID of player 2.
   *
   * @returns The ID of player 2.
   */
  public getPlayer2ID() {
    return this.player2ID;
  }

  /**
   * Returns the ID of the opponent of the given player.
   *
   * @param playerID The socket ID of the current player.
   * @returns The opponent's ID.
   */
  public getOppositePlayer(playerID: string): string {
    const oppositePlayer: string = playerID === this.player1ID ? this.player2ID : this.player1ID;
    return oppositePlayer;
  }

  /**
   * Adds a player to the battle and creates their team from their team selection.
   *
   * @param playerID The ID of the player.
   * @param name The name of the player.
   * @param teamSelection The player's team selection where the keys are the names of the selected Pokemon
   *                      and the values are that selected Pokemon's moves.
   */
  public async setPlayer(playerID: string, name: string, teamSelection: Record<string, string[]>): Promise<void> {
    // Create a new player if they haven't already been added
    if (!(playerID in this.players)) {
      const pokemonTeam: Pokemon[] = await PokemonFactory.createTeam(teamSelection);
      this.players[playerID] = new Player(name, pokemonTeam);
    }

    // Assign them as player 1 if they're the first to join, otherwise player 2
    if (Object.keys(this.players).length === 1) {
      this.player1ID = playerID;
    } else {
      this.player2ID = playerID;
    }
  }

  /** Returns a boolean indicating if two players have joined the battle.
   *
   * @returns true if two players have been added to the battle, false otherwise.
   */
  public hasTwoPlayers(): boolean {
    return Object.keys(this.players).length === 2;
  }

  /**
   * Records the move chosen by a player for the current turn by adding it to
   * the moves object.
   *
   * @param playerID The ID of the player submitting the move.
   * @param playerMove The move the player chooses to perform.
   */
  public addMove(playerID: string, playerMove: PlayerMove): void {
    this.moves[playerID] = playerMove;
  }

  /**
   * Returns a boolean indicating whether both players have submitted their moves
   * for the turn.
   *
   * @returns true if both players have submitted a move, false otherwise.
   */
  public isReadyToHandleTurn(): boolean {
    return Object.keys(this.moves).length === 2;
  }

  /**
   * Returns the Player instance and chosen move for a given player ID.
   *
   * @param playerID The ID of the player.
   */
  public getPlayerAndMoveByID(playerID: string) {
    return { player: this.players[playerID], playerMove: this.moves[playerID] };
  }

  /**
   * Handle's the actions for the players.
   */
  public handleTurn(): void {
    const { playerMove: p1Move } = this.getPlayerAndMoveByID(this.player1ID);
    const { playerMove: p2Move } = this.getPlayerAndMoveByID(this.player2ID);

    if (p1Move.action === "attack" && p2Move.action === "attack") {
      this.handleAttack();
    } else if (p1Move.action === "switch" && p2Move.action === "switch") {
      this.processSwitch(this.player1ID);
      this.processSwitch(this.player2ID);
    } else {
      this.handleSingleSwitch();
    }

    // The effects collected in processAttack
    // Inflicts effect damage after the attacks have been processed
    this.endTurnEffects.forEach((endTurnEffect) => {
      const player = endTurnEffect.player;
      const effect = endTurnEffect.effect;
      const result = effect();
      if (result) this.events.push(this.createEvent(player, "status", result));
    });
    this.endTurnEffects = [];

    // Checks whether any of the pokemon have fainted after all moves and status effects
    // have been applied for the turn
    [this.player1ID, this.player2ID].forEach((playerID) => {
      const { player } = this.getPlayerAndMoveByID(playerID);
      const currentPokemon = player.getCurrentPokemon();
      if (this.battleUtils.pokemonIsDefeated(player)) {
        this.events.push(this.createEvent(playerID, "faint", `${currentPokemon.getName()} has fainted!`));
        player.reduceRemainingPokemon();
        this.faintedPlayers.push(playerID);
        this.gameOver = !player.hasRemainingPokemon() || this.gameOver;
      }
    });

    this.moves = {};
  }

  /**
   * Handles a turn where exactly one player has chosen to switch Pokemon, while
   * the other attacks.
   */
  public handleSingleSwitch() {
    const { playerMove: p1Move } = this.getPlayerAndMoveByID(this.player1ID);

    const switchingPlayer = p1Move.action === "switch" ? this.player1ID : this.player2ID;
    const attackingPlayer = switchingPlayer === this.player1ID ? this.player2ID : this.player1ID;

    this.processSwitch(switchingPlayer);
    this.processAttack(attackingPlayer);
  }

  /**
   * Handles the attack logic for battle.
   *
   * @param p1Move Player 1's move.
   * @param p2Move Player 2's move.
   * @returns void
   */
  private handleAttack(): void {
    const { player: player1 } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2 } = this.getPlayerAndMoveByID(this.player2ID);

    // Determine the order of attack
    const fasterPlayer: Player = this.battleUtils.getFasterPlayer(player1, player2);
    const slowerPlayer: Player = fasterPlayer === player1 ? player2 : player1;
    const firstPlayer = fasterPlayer === player1 ? this.player1ID : this.player2ID;
    const secondPlayer = firstPlayer === this.player1ID ? this.player2ID : this.player1ID;

    // Attack with the first player (the faster player)
    this.processAttack(firstPlayer);
    if (this.battleUtils.pokemonIsDefeated(slowerPlayer)) {
      return;
    }

    // Attack with the second player (the slower player) if pokemon has not fainted
    this.processAttack(secondPlayer);
  }

  /**
   * Handles switching pokemon for the player.
   *
   * @param player The player that wants to switch pokemon.
   * @param pokemonIndex The index of the pokemon to switch to.
   */
  private processSwitch(playerID: string): void {
    const { player, playerMove } = this.getPlayerAndMoveByID(playerID);
    player.switchPokemon(playerMove.index);
    const message = `${player.getName()} switched to ${player.getCurrentPokemon().getName()}!`;
    this.events.push(this.createEvent(playerID, "switch", message));
  }

  /**
   * Handles an attack from a pokemon.
   *
   * @param playerID The playerID of the attacking player.
   * @returns void
   */
  private processAttack(playerID: string): void {
    const { player: player1 } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2 } = this.getPlayerAndMoveByID(this.player2ID);
    const attackingPlayer = this.players[playerID];
    const { playerMove } = this.getPlayerAndMoveByID(playerID);

    // Determine which player is attacking and defending
    const defendingPlayer: Player = attackingPlayer === player1 ? player2 : player1;
    const attackingPokemon: Pokemon = attackingPlayer.getCurrentPokemon();
    const defendingPokemon: Pokemon = defendingPlayer.getCurrentPokemon();
    const move = attackingPokemon.getMove(playerMove.index);

    // Check whether the attacking pokemon is able to move this turn
    // Add the message associated to the effect that is applied
    const pokemonStatus = StatusManager.checkIfCanMove(attackingPokemon);
    if (pokemonStatus.message) {
      this.events.push(this.createEvent(playerID, "status", pokemonStatus.message));
    }

    // Add the message associated with the effect that happens at the end of the turn
    if (pokemonStatus.endTurnEffect) {
      this.endTurnEffects.push({
        player: playerID,
        effect: pokemonStatus.endTurnEffect,
      });
    }

    // If the effect prevents the pokemon from moving/attacking, then this skips the attack (confuse, sleep, etc.)
    if (!pokemonStatus.canMove) {
      return;
    }

    // Add attack message from pokemon
    const message = `${attackingPokemon.getName()} used ${move.getName()}!`;
    this.events.push(this.createEvent(playerID, "attack", message));

    // Attack flow
    const damage: number = this.battleUtils.calculateDamage(attackingPokemon, move, defendingPokemon);
    move.reducePP();
    defendingPokemon.takeDamage(damage);

    // Display messages related to attack damage
    this.battleUtils.getModiferMessages().forEach((modifierMessage: string) => {
      this.events.push(this.createEvent(playerID, "none", modifierMessage));
    });

    // New status effects may be inflicted based on the move used
    // const effectMessage = StatusManager.tryApplyEffect(
    //   attackingPokemon,
    //   defendingPokemon,
    //   move
    // );
    // if (effectMessage) this.messages.push(effectMessage); ///////////////
  }

  /**
   * Returns a boolean indicating if a player has fainted in the current turn.
   *
   * @returns true if there is at least one fainted player, false otherwise.
   */
  public hasFaintedPlayers(): boolean {
    return this.faintedPlayers.length != 0;
  }

  /**
   * Returns the list of player IDs whose Pokemon have fainted in the current turn.
   *
   * @returns The list of player IDs whose Pokemon have fainted in the current turn.
   */
  public getFaintedPlayers(): string[] {
    return this.faintedPlayers;
  }

  /**
   * Returns a boolean indicating if all the fainted players have submitted their Pokemon
   * switch choice.
   *
   * @returns true if all of the fainted players have submitted a switch choice, false otherwise.
   */
  public isReadyToHandleFaintedSwitch(): boolean {
    return this.faintedPlayers.length === Object.keys(this.moves).length;
  }

  /**
   * Handles switching in new Pokemon for players whose current Pokemon have fainted.
   */
  public handleFaintedSwitch(): void {
    const [faintedPlayer1, faintedPlayer2] = this.faintedPlayers;
    if (faintedPlayer1 && faintedPlayer2) {
      this.processSwitch(faintedPlayer1);
      this.processSwitch(faintedPlayer2);
    } else {
      this.processSwitch(faintedPlayer1);
    }
    this.faintedPlayers = [];
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
   * Creates an event object describing an action taken by a player.
   * The event includes metadata like the Pokemon's image, name, and type.
   *
   * @param currentPlayer The ID of the player taking the action.
   * @param action The type of action (e.g., "attack", "switch", "status").
   * @param message The message that displays during the event.
   * @returns An Event object.
   */
  private createEvent(currentPlayer: string, action: string, message: string): Event {
    const { player, playerMove } = this.getPlayerAndMoveByID(currentPlayer);
    const playerPokemon = player.getCurrentPokemon();

    const event: Event = {
      user: currentPlayer,
      animation: action,
      message: message,
      type: "",
      image: "",
      name: "",
      pokemon: playerPokemon,
    };

    if (action === "attack") {
      event.type = playerPokemon.getMove(playerMove.index).getType();
    } else if (action === "status") {
      event.type = playerPokemon.getStatus();
    }
    return event;
  }

  /**
   * Personalizes the event list for a specific player by changing the event
   * metadata to be from the perspective of "self" vs "opponent", and updates
   * images and names accordingly for switch events.
   *
   * @param playerID The ID of the player viewing the events.
   * @returns A list of personalized Event objects.
   */
  private personalizeEvents(playerID: string): Event[] {
    const personalizedEvents: Event[] = this.events.map((event: Event) => {
      const personalizedEvent: Event = {
        user: playerID === event.user ? "self" : "opponent",
        animation: event.animation,
        message: event.message,
        type: event.type,
        image: event.image,
        name: event.name,
      };

      if (event.animation === "switch" && event.pokemon) {
        personalizedEvent.image =
          personalizedEvent.user === "self" ? event.pokemon.getBackSprite() : event.pokemon.getFrontSprite();
        personalizedEvent.name = event.pokemon.getName();
      }
      return personalizedEvent;
    });
    return personalizedEvents;
  }

  /**
   * Returns a summary of the turn for both players, with events personalized
   * to each player's perspective. Also clears the internal event list.
   *
   * @returns A mapping of player IDs to their respective personalized Events in an array.
   */
  public getTurnSummary(): Record<string, Event[]> {
    const turnSummary: Record<string, Event[]> = {};
    turnSummary[this.player1ID] = this.personalizeEvents(this.player1ID);
    turnSummary[this.player2ID] = this.personalizeEvents(this.player2ID);
    this.events = [];
    return turnSummary;
  }

  /**
   * Returns the current Pokemon's moves for the given player.
   *
   * @param playerID The ID of the player.
   * @returns An array of objects, each mapping a move name to its PP.
   */
  private getPlayerMoveOptions(playerID: string): MoveOptions[] {
    const { player } = this.getPlayerAndMoveByID(playerID);
    const currentPokemon = player.getCurrentPokemon();
    const playerMoves = currentPokemon.getMoves().map((move) => ({
      name: move.getName(),
      type: move.getType(),
      pp: move.getPP(),
      maxPP: move.getMaxPP(),
    }));

    return playerMoves;
  }

  /**
   * Returns the team of Pokémon for the given player.
   *
   * @param playerID The ID of the player.
   * @returns An array of PlayerPokemon objects with basic info.
   */
  private getPlayerPokemonOptions(playerID: string): PokemonOptions[] {
    const { player } = this.getPlayerAndMoveByID(playerID);
    const playerTeam: PokemonOptions[] = [];
    for (const pokemon of player.getTeam()) {
      const playerPokemon: PokemonOptions = {
        name: pokemon.getName(),
        hp: pokemon.getHP(),
        maxHP: pokemon.getMaxHP(),
        sprite: pokemon.getFrontSprite(),
      };
      playerTeam.push(playerPokemon);
    }
    return playerTeam;
  }

  /**
   * Returns the list of Pokemon the given player can switch to.
   *
   * @param playerID The ID of the player.
   * @returns The list of Pokemon the given player can switch to.
   */
  public getSwitchOptions(playerID: string): PokemonOptions[] {
    return this.getPlayerPokemonOptions(playerID);
  }

  /**
   * Builds the set of available moves, Pokemon to switch to and opponent Pokemon team for the given player.
   *
   * @param playerID The ID of the player.
   * @returns An object containing the available moves and Pokemon to switch for the given player.
   */
  public buildPlayerNextOptions(playerID: string): NextOptions {
    // const opponentID = this.getOppositePlayer(playerID);
    // const opponentPlayer = this.players[opponentID];

    // const opponentTeam = opponentPlayer.getTeam().map((pokemon) => ({
    //   name: pokemon.getName(),
    //   hp: pokemon.getHP(),
    //   maxHp: pokemon.getMaxHP(),
    //   sprite: pokemon.getFrontSprite(),
    // }));

    // const opponentActiveIndex = opponentPlayer.getCurrentPokemonIndex();

    const nextOptions: NextOptions = {
      moves: this.getPlayerMoveOptions(playerID),
      pokemon: this.getPlayerPokemonOptions(playerID),
    };
    return nextOptions;
  }

  /**
   * Builds the set of available moves, Pokemon switches and opponent team for both players.
   *
   * @returns An object mapping the player ID to an object containing the avaiable moves
   *          , opponent team and Pokemon that player can switch to.
   */
  public getNextOptions(): Record<string, NextOptions> {
    const nextOptions: Record<string, NextOptions> = {};
    nextOptions[this.player1ID] = this.buildPlayerNextOptions(this.player1ID);
    nextOptions[this.player2ID] = this.buildPlayerNextOptions(this.player2ID);
    return nextOptions;
  }

  /**
   * Builds the current state information for both players.
   * This includes details about their own Pokemon and their opponent’s Pokemon.
   *
   * @returns A mapping from each player ID to their current state.
   */
  public getCurrentState(): Record<string, CurrentState> {
    const currentState: Record<string, CurrentState> = {};
    currentState[this.player1ID] = this.buildPlayerCurrentState(this.player1ID);
    currentState[this.player2ID] = this.buildPlayerCurrentState(this.player2ID);
    return currentState;
  }

  /**
   * Builds the current state for a specific player.
   * Includes information about the player’s active Pokemon and the opponent’s active Pokemon.
   *
   * @param playerID The ID of the player.
   * @returns A CurrentState object containing self and opponent details
   */
  public buildPlayerCurrentState(playerID: string): CurrentState {
    const { player } = this.getPlayerAndMoveByID(playerID);
    const playerPokemon: Pokemon = player.getCurrentPokemon();

    const opponentID = this.getOppositePlayer(playerID);
    const { player: opponentPlayer } = this.getPlayerAndMoveByID(opponentID);
    const opponentPokemon = opponentPlayer.getCurrentPokemon();

    const playerState: CurrentState = {
      self: {
        name: playerPokemon.getName(),
        hp: playerPokemon.getHP(),
        maxHP: playerPokemon.getMaxHP(),
        sprite: playerPokemon.getBackSprite(),
        remainingPokemon: player.getRemainingPokemon(),
        teamCount: player.getTeam().length,
      },
      opponent: {
        name: opponentPokemon.getName(),
        hp: opponentPokemon.getHP(),
        maxHP: opponentPokemon.getMaxHP(),
        sprite: opponentPokemon.getFrontSprite(),
        remainingPokemon: opponentPlayer.getRemainingPokemon(),
        teamCount: opponentPlayer.getTeam().length,
      },
    };

    return playerState;
  }

  /**
   * Adds a bot player to the battle and generates a random team for it.
   * Used for single-player battles.
   */
  public async addBotPlayer(): Promise<void> {
    this.botPlayer = new BotPlayer();
    await this.botPlayer.generateRandomTeam();
    await this.setPlayer(this.botPlayer.getID(), this.botPlayer.getName(), this.botPlayer.getTeam());
  }

  /**
   * Adds an attack move for the bot.
   */
  public addBotAttackMove() {
    const moveIndex: number = this.botPlayer.selectAttackMove();
    this.addMove(this.botPlayer.getID(), {
      action: "attack",
      index: moveIndex,
    });
  }

  /**
   * Adds a switch move for the bot.
   */
  public addBotSwitchMove() {
    const switchIndex: number = this.botPlayer.selectSwitchMove();
    this.addMove(this.botPlayer.getID(), {
      action: "switch",
      index: switchIndex,
    });
  }

  /**
   * Returns a boolean indicating whether the given ID belongs to the bot player.
   *
   * @param playerID The ID of the player.
   * @returns true if the ID belongs to the bot, false otherwise.
   */
  public isBotPlayer(playerID: string): boolean {
    return playerID === this.botPlayer.getID();
  }
}
