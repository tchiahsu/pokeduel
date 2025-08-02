import BattleUtils from "./BattleUtils.js";
import Player from "./Player.js";
import Pokemon from "./Pokemon.js";
import PokemonFactory from "./PokemonFactory.js";
import StatusManager from "./StatusManager.js";
import BotPlayer from "./BotPlayer.js";

/**
 * An type representing a player's move.
 */
type PlayerMove = {
  action: string;
  index: number;
};

type NextOptions = {
  moves: Record<string, number>[];
  pokemon: PlayerPokemon[];
};

type PlayerPokemon = {
  name: string;
  hp: number;
  sprite: string;
};

type Event = {
  user: string; // "self" | "opponent"
  animation: string; // "attack" | "switch" | "status" | "faint" | "none"
  message: string;
  type: string;
  image: string;
  name: string;
  pokemon?: Pokemon;
};

type EndTurnEffect = {
  player: string;
  effect: () => string | null;
};

/**
 * A class representing the core logic of the pokemon battle system.
 */
export default class BattleModel {
  // The IDs of the players (their socket IDs)
  private player1ID: string;
  private player2ID: string;
  // Maps the IDs of the players to their in-game Player
  private players: Record<string, Player> = {};
  // Maps the IDs of the players to their moves
  private moves: Record<string, PlayerMove> = {};
  private endTurnEffects: EndTurnEffect[] = [];
  private gameOver: boolean = false;
  private events: Event[] = [];
  private battleUtils: BattleUtils = new BattleUtils();
  private faintedPlayers: string[] = [];
  private botPlayer: BotPlayer;

  public getPlayer1ID() {
    return this.player1ID;
  }

  public getPlayer2ID() {
    return this.player2ID;
  }

  public getOppositePlayer(playerID: string) {
    const oppositePlayer: string = playerID === this.player1ID ? this.player2ID : this.player1ID;
    return oppositePlayer;
  }

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

  public hasTwoPlayers() {
    return Object.keys(this.players).length === 2;
  }

  public addMove(playerID: string, playerMove: PlayerMove): void {
    this.moves[playerID] = playerMove;
  }

  public isReadyToHandleTurn(): boolean {
    return Object.keys(this.moves).length === 2;
  }

  public getPlayerAndMoveByID(playerID: string) {
    return { player: this.players[playerID], playerMove: this.moves[playerID] };
  }

  /**
   * Handle's the actions for the players.
   */
  public handleTurn(): void {
    const { player: player1, playerMove: p1Move } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2, playerMove: p2Move } = this.getPlayerAndMoveByID(this.player2ID);

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
    const { player: player1, playerMove: p1Move } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2, playerMove: p2Move } = this.getPlayerAndMoveByID(this.player2ID);

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
   * @param attackingPlayer The attack player.
   * @param attackIndex The index of the move the player wants to use.
   * @returns void
   */
  private processAttack(playerID: string): void {
    const { player: player1, playerMove: p1Move } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2, playerMove: p2Move } = this.getPlayerAndMoveByID(this.player2ID);
    const attackingPlayer = this.players[playerID];
    const { playerMove } = this.getPlayerAndMoveByID(this.player1ID);

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

  public hasFaintedPlayers(): boolean {
    return this.faintedPlayers.length != 0;
  }

  public getFaintedPlayers(): string[] {
    return this.faintedPlayers;
  }

  public isReadyToHandleFaintedSwitch(): boolean {
    return this.faintedPlayers.length === Object.keys(this.moves).length;
  }

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
   * @param currentPlayer - The ID of the player taking the action.
   * @param action - The type of action (e.g., "attack", "switch", "status").
   * @param message - The message that displays during the event.
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
   * @param playerID - The ID of the player viewing the events.
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
   * @param playerID - The ID of the player.
   * @returns An array of objects, each mapping a move name to its PP.
   */
  private getPlayerMoveOptions(playerID: string): Record<string, number>[] {
    const { player } = this.getPlayerAndMoveByID(playerID);
    const currentPokemon = player.getCurrentPokemon();
    const playerMoves: Record<string, number>[] = [];
    for (const move of currentPokemon.getMoves()) {
      playerMoves.push({ [move.getName()]: move.getPP() });
    }
    return playerMoves;
  }

  /**
   * Returns the team of Pokémon for the given player.
   *
   * @param playerID - The ID of the player.
   * @returns An array of PlayerPokemon objects with basic info.
   */
  private getPlayerPokemonOptions(playerID: string): PlayerPokemon[] {
    const { player } = this.getPlayerAndMoveByID(playerID);
    const playerTeam: PlayerPokemon[] = [];
    for (const pokemon of player.getTeam()) {
      const playerPokemon: PlayerPokemon = {
        name: pokemon.getName(),
        hp: pokemon.getHp(),
        sprite: pokemon.getFrontSprite(),
      };
      playerTeam.push(playerPokemon);
    }
    return playerTeam;
  }

  public getSwitchOptions(playerID: string): PlayerPokemon[] {
    return this.getPlayerPokemonOptions(playerID);
  }

  public buildPlayerNextOptions(playerID: string): NextOptions {
    const nextOptions: NextOptions = {
      moves: this.getPlayerMoveOptions(playerID),
      pokemon: this.getPlayerPokemonOptions(playerID),
    };

    return nextOptions;
  }

  public getNextOptions(): Record<string, NextOptions> {
    const nextOptions: Record<string, NextOptions> = {};
    nextOptions[this.player1ID] = this.buildPlayerNextOptions(this.player1ID);
    nextOptions[this.player2ID] = this.buildPlayerNextOptions(this.player2ID);
    return nextOptions;
  }

  public async addBotPlayer(): Promise<void> {
    this.botPlayer = new BotPlayer();
    await this.botPlayer.generateRandomTeam();
    await this.setPlayer(this.botPlayer.getID(), this.botPlayer.getName(), this.botPlayer.getTeam());
  }

  public addBotAttackMove() {
    const moveIndex: number = this.botPlayer.selectAttackMove();
    this.addMove(this.botPlayer.getID(), {
      action: "attack",
      index: moveIndex,
    });
  }

  public addBotSwitchMove() {
    const switchIndex: number = this.botPlayer.selectSwitchMove();
    this.addMove(this.botPlayer.getID(), {
      action: "switch",
      index: switchIndex,
    });
  }

  public isBotPlayer(playerID: string): boolean {
    return playerID === this.botPlayer.getID();
  }
}

const genericTeam = {
  venusaur: ["solar-beam", "sludge-bomb", "sleep-powder", "earthquake"],
  charizard: ["flamethrower", "air-slash", "dragon-claw", "earthquake"],
};
