import BattleUtils from "./BattleUtils.js";
import Player from "./Player.js";
import Pokemon from "./Pokemon.js";
import PokemonFactory from "./PokemonFactory.js";
import StatusManager from "./StatusManager.js";

/**
 * An type representing a player's move.
 */
type PlayerMove = {
  action: string;
  index: number;
};

type nextOptions = {
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
  animation: string; // "attack" | "switch" | "status" | "none"
  message: string;
  type: string;
  image: string;
  name: string;
  pokemon?: Pokemon;
};

/**
 * A class representing the core logic of the pokemon battle system.
 */
export default class BattleModel {
  // The IDs of the players (their socket IDs)
  private player1ID: string;
  private player2ID: string;
  private players: Record<string, Player> = {};
  private moves: Record<string, PlayerMove> = {};
  private endTurnEffects: (() => string | null)[] = [];
  private gameOver: boolean = false;
  private events: Event[] = [];
  private messages: string[] = [];
  private battleUtils: BattleUtils = new BattleUtils();

  public getPlayer1ID() {
    return this.player1ID;
  }

  public getPlayer2ID() {
    return this.player2ID;
  }

  public async setPlayer(
    playerID: string,
    name: string,
    teamSelection: Record<string, string[]>
  ): Promise<void> {
    if (!(playerID in this.players)) {
      const pokemonTeam: Pokemon[] = await PokemonFactory.createTeam(
        teamSelection
      );
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

  public readyToHandleTurn(): boolean {
    return Object.keys(this.moves).length === 2;
  }

  public getPlayerAndMoveByID(playerID: string) {
    return { player: this.players[playerID], playerMove: this.moves[playerID] };
  }

  /**
   * Handle's the actions for the players.
   *
   */
  public handleTurn(): void {
    const { player: player1, playerMove: p1Move } = this.getPlayerAndMoveByID(
      this.player1ID
    );
    const { player: player2, playerMove: p2Move } = this.getPlayerAndMoveByID(
      this.player2ID
    );

    if (p1Move.action === "attack" && p2Move.action === "attack") {
      this.handleAttack();
    } else if (p1Move.action === "switch" && p2Move.action === "switch") {
      this.processSwitch(this.player1ID);
      this.processSwitch(this.player2ID);
    } else {
      this.handleSingleSwitch();
    }

    // This effects are collected in processAttack
    // Its meant to inflict effect damage after the attacks have been processed
    this.endTurnEffects.forEach((effect) => {
      const result = effect();
      if (result) this.messages.push(result);
    });
    this.endTurnEffects = [];

    // Checks whether any of the pokemon has fainted after all moves and status effects
    // have been applied for the turn
    [player1, player2].forEach((player) => {
      const currentPokemon = player.getCurrentPokemon();
      if (currentPokemon.getHp() <= 0 && player.hasRemainingPokemon()) {
        this.messages.push(`${currentPokemon.getName()} has fainted!`);
        player.reduceRemainingPokemon();
        this.gameOver = !player.hasRemainingPokemon();
      }
    });

    this.moves = {};
  }

  public handleSingleSwitch() {
    const { playerMove: p1Move } = this.getPlayerAndMoveByID(this.player1ID);

    const switchingPlayer =
      p1Move.action === "switch" ? this.player1ID : this.player2ID;
    const attackingPlayer =
      switchingPlayer === this.player1ID ? this.player2ID : this.player1ID;

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
    const { player: player1, playerMove: p1Move } = this.getPlayerAndMoveByID(
      this.player1ID
    );
    const { player: player2, playerMove: p2Move } = this.getPlayerAndMoveByID(
      this.player2ID
    );

    // Determine the order of attack
    const fasterPlayer: Player = this.battleUtils.getFasterPlayer(
      player1,
      player2
    );
    const slowerPlayer: Player = fasterPlayer === player1 ? player2 : player1;
    const firstPlayer =
      fasterPlayer === player1 ? this.player1ID : this.player2ID;
    const secondPlayer =
      firstPlayer === this.player1ID ? this.player2ID : this.player1ID;

    // Attack with the first player
    this.processAttack(firstPlayer);
    if (this.battleUtils.pokemonIsDefeated(slowerPlayer)) {
      return;
    }

    // Attack with the second player if pokemon has not fainted
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
    const message = `${player.getName()} switched to ${player
      .getCurrentPokemon()
      .getName()}!`;
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
    const { player: player1, playerMove: p1Move } = this.getPlayerAndMoveByID(
      this.player1ID
    );
    const { player: player2, playerMove: p2Move } = this.getPlayerAndMoveByID(
      this.player2ID
    );
    const attackingPlayer = this.players[playerID];
    const { playerMove } = this.getPlayerAndMoveByID(this.player1ID);

    // Determine which player is attacking and defending
    const defendingPlayer: Player =
      attackingPlayer === player1 ? player2 : player1;
    const attackingPokemon: Pokemon = attackingPlayer.getCurrentPokemon();
    const defendingPokemon: Pokemon = defendingPlayer.getCurrentPokemon();
    const move = attackingPokemon.getMove(playerMove.index);

    // Check whether the attacking pokemon is able to move this turn
    // Add the message associated to the effect that is applied
    const statusMessage = StatusManager.checkIfCanMove(attackingPokemon);
    if (statusMessage.message) {
      this.events.push(
        this.createEvent(playerID, "status", statusMessage.message)
      );
    }

    // Add the message associated to the effect that happens at the end of the turn
    if (statusMessage.endTurnEffect) {
      this.endTurnEffects.push(statusMessage.endTurnEffect);
    }

    // If the effect prevents the pokemon from moving/attacking, then this skips the attack
    if (!statusMessage.canMove) {
      // Starts the fainting flow if the effect lowers pokemon HP to 0
      if (attackingPokemon.getHp() <= 0) {
        this.messages.push(`${attackingPokemon.getName()} has fainted!`);
        attackingPlayer.reduceRemainingPokemon();
        this.gameOver = !attackingPlayer.hasRemainingPokemon();
      }
      // Return if the pokemon can't attack and hasn't fainted
      return;
    }

    // Add attack message from pokemon
    const message = `${attackingPokemon.getName()} used ${move.getName()}!`;
    this.events.push(this.createEvent(playerID, "attack", message));

    // Attack flow
    const damage: number = this.battleUtils.calculateDamage(
      attackingPokemon,
      move,
      defendingPokemon
    );
    move.reducePP();
    defendingPokemon.takeDamage(damage);

    // Display messages related to attack damage
    this.battleUtils.getModiferMessages().forEach((modifierMessage: string) => {
      this.events.push(this.createEvent(playerID, "none", modifierMessage));
    });

    // New status effects may be inflicted based on the move used
    const effectMessage = StatusManager.tryApplyEffect(
      attackingPokemon,
      defendingPokemon,
      move
    );
    if (effectMessage) this.messages.push(effectMessage);

    // Handle pokemon fainting
    if (this.battleUtils.pokemonIsDefeated(defendingPlayer)) {
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
    const { player: player1 } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2 } = this.getPlayerAndMoveByID(this.player2ID);

    const player1Options: string =
      `${player1.getName()}'s options: \n` +
      `Attack with ${player1
        .getCurrentPokemon()
        .getName()}: ${this.battleUtils.getAllMoves(player1)}\n` +
      `Switch Pokemon: ${this.battleUtils.getRemainingPokemon(player1)}\n`;

    const player2Options: string =
      `${player2.getName()}'s options: \n` +
      `Attack with ${player2
        .getCurrentPokemon()
        .getName()}: ${this.battleUtils.getAllMoves(player2)}\n` +
      `Switch Pokemon: ${this.battleUtils.getRemainingPokemon(player2)}\n`;

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

  // /**
  //  * Returns whether one of the current pokemon has fainted.
  //  *
  //  * @returns Whether one of the current pokemon has fainted.
  //  */
  // public aPokemonHasFainted(): boolean {
  //   const {player1, player2} = this.getTurnContext();

  //   return BattleUtils.pokemonIsDefeated(player1) || BattleUtils.pokemonIsDefeated(player2);
  // }

  /**
   * Returns the player's remaining pokemon.
   *
   * @returns The player's remaining pokemon.
   */
  public getRemainingPokemon() {
    const { player: player1 } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2 } = this.getPlayerAndMoveByID(this.player2ID);

    const faintedPlayer: Player = this.battleUtils.pokemonIsDefeated(player1)
      ? player1
      : player2;
    return `${faintedPlayer.getName()}'s Pokemons: ${this.battleUtils.getRemainingPokemon(
      faintedPlayer
    )}`;
  }

  /**
   * Handles switching out a fainted pokemon and returns a message notifying the player has switched pokemon.
   *
   * @param switchMove The player's move with the index of the pokemon to switch to.
   * @returns A message notifying the fainted player has switched pokemon.
   */
  public handleFaintedPokemon(switchMove: PlayerMove): string {
    const { player: player1 } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2 } = this.getPlayerAndMoveByID(this.player2ID);

    const faintedPlayer: Player = this.battleUtils.pokemonIsDefeated(player1)
      ? player1
      : player2;
    //faintedPlayer.updateTeam(faintedPlayer.getCurrentPokemonIndex());
    faintedPlayer.switchPokemon(switchMove.index);
    return `${faintedPlayer.getName()} switched to ${faintedPlayer
      .getCurrentPokemon()
      .getName()}!\n`;
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
    const { player: player1 } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2 } = this.getPlayerAndMoveByID(this.player2ID);

    const faintedPlayer: Player = player1.hasRemainingPokemon()
      ? player2
      : player1;
    const otherPlayer: Player = faintedPlayer === player1 ? player2 : player1;

    return `${faintedPlayer.getName()} is out of Pokemon! ${otherPlayer.getName()} wins!`;
  }

  /**
   * Determine which player's pokemon has fainted
   */
  public getFaintedPlayer(): number {
    const { player: player1 } = this.getPlayerAndMoveByID(this.player1ID);
    const { player: player2 } = this.getPlayerAndMoveByID(this.player2ID);

    if (this.battleUtils.pokemonIsDefeated(player1)) return 1;
    if (this.battleUtils.pokemonIsDefeated(player2)) return 2;
    throw new Error("No player has fainted.");
  }

  /**
   * Returns the current Pokemon's moves for the given player.
   *
   * @param playerID - The ID of the player.
   * @returns An array of objects, each mapping a move name to its PP.
   */
  private getPlayerMoves(playerID: string): Record<string, number>[] {
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
  private getPlayerPokemon(playerID: string): PlayerPokemon[] {
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

  /**
   * Creates an event object describing an action taken by a player.
   * The event includes metadata like the Pokemon's image, name, and type.
   *
   * @param currentPlayer - The ID of the player taking the action.
   * @param action - The type of action (e.g., "attack", "switch", "status").
   * @param message - The message that displays during the event.
   * @returns An Event object.
   */
  private createEvent(
    currentPlayer: string,
    action: string,
    message: string
  ): Event {
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
          personalizedEvent.user === "self"
            ? event.pokemon.getBackSprite()
            : event.pokemon.getFrontSprite();
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
}
