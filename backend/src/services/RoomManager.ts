import BattleModel from "../model/BattleModel.js";

/**
 * A class for managing active game rooms, associating players with rooms,
 * and keeping track of room states and BattleModel instances.
 */
export default class RoomManager {
  // Maps a roomID to their associated BattleModel
  private roomToBattleModel: Record<string, BattleModel> = {};
  // Maps a player's socket ID to their roomID
  private playerToRoom: Record<string, string> = {};
  // Tracks how many players are in each room
  private roomPlayerCount: Record<string, number> = {};

  /**
   * Checks whether a given room ID corresponds to an existing room.
   *
   * @param roomID - The ID of the room to check.
   * @returns True if the room exists, false otherwise.
   */
  public isRoom(roomID: string): boolean {
    return roomID in this.roomToBattleModel;
  }

  /**
   * Creates a new room and initializes its BattleModel.
   *
   * @param roomID - The ID to assign to the new room.
   * @returns The BattleModel associated with the newly created room.
   */
  public createRoom(roomID: string) {
    this.roomToBattleModel[roomID] = new BattleModel();
    this.roomPlayerCount[roomID] = 0;
  }

  /**
   * Deletes a room and its associated data.
   *
   * @param roomID - The ID of the room to delete.
   */
  public deleteRoom(roomID: string): void {
    delete this.roomToBattleModel[roomID];
    delete this.roomPlayerCount[roomID];
  }

  /**
   * Returns a list of all current room IDs.
   *
   * @returns An array of room IDs.
   */
  public getRooms(): string[] {
    return Object.keys(this.roomToBattleModel);
  }

  /**
   * Checks whether a room is full.
   *
   * @param roomID - The ID of the room to check.
   * @returns True if the room is full, false otherwise.
   */
  public IsRoomFull(roomID: string): boolean {
    return this.roomPlayerCount[roomID] == 2;
  }

  /**
   * Checks if the waiting room (selection screen) is empty.
   *
   * @param roomID - The ID of the room to check.
   * @returns True if there are zero players, false otherwise.
   */
  public isWaitingRoomEmpty(roomID: string) {
    return this.roomPlayerCount[roomID] == 0;
  }

  /**
   * Adds a player to a room and increments the room's player count.
   *
   * @param playerID - The player's ID.
   * @param roomID - The ID of the room to add the player to.
   */
  public addPlayerToRoom(playerID: string, roomID: string): void {
    this.playerToRoom[playerID] = roomID;
    this.roomPlayerCount[roomID] += 1;
  }

  /**
   * Returns the number of players currently in a room.
   *
   * @param roomID - The room's ID.
   * @returns The number of players in the room.
   */
  public getRoomPlayerCount(roomID: string) {
    return this.roomPlayerCount[roomID];
  }

  /**
   * Removes a player from their room and decrements the room's player count.
   *
   * @param playerID - The ID of the player to remove.
   */
  public removePlayerFromRoom(playerID: string): void {
    const roomID: string = this.playerToRoom[playerID];
    delete this.playerToRoom[playerID];
    this.roomPlayerCount[roomID] -= 1;
  }

  /**
   * Gets the room ID that a given player is currently in.
   *
   * @param playerID - The player's ID.
   * @returns The room ID associated with the player.
   */
  public getPlayerRoom(playerID: string): string {
    return this.playerToRoom[playerID];
  }

  /**
   * Gets the BattleModel instance associated with a room.
   *
   * @param roomID - The room's ID.
   * @returns The BattleModel for the room.
   */
  public getBattleModel(roomID: string): BattleModel {
    return this.roomToBattleModel[roomID];
  }
}
