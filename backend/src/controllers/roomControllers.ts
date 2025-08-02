import { Request, Response } from "express";
import ShortUniqueId from "short-unique-id";
import RoomManager from "../services/RoomManager.js";

// Creates a new room
// POST /room
export function createRoom(req: Request, res: Response, roomManager: RoomManager) {
  const isSinglePlayer: boolean = req.body.isSinglePlayer;
  const { randomUUID } = new ShortUniqueId({ length: 10 });
  let roomID: string = randomUUID();
  while (roomManager.isRoom(roomID)) {
    roomID = randomUUID();
  }
  roomManager.createRoom(roomID, isSinglePlayer);
  res.status(201).json({ id: roomID });
}

// Deletes an existing room by ID
// DELETE /room/:id
export function deleteRoom(req: Request, res: Response, roomManager: RoomManager) {
  const roomID = req.params.id;
  roomManager.deleteRoom(roomID);
  res.status(200).json({ message: `Room ${roomID} deleted` });
}

// Checks if a room is available (exists and is not full)
// GET /room/:id
export function getRoom(req: Request, res: Response, roomManager: RoomManager) {
  const roomID = req.params.id;
  if (!roomManager.isRoom(roomID)) {
    return res.status(404).json({ available: false, message: `Room ${roomID} not found` });
  } else if (roomManager.IsRoomFull(roomID)) {
    return res.status(409).json({ available: false, message: `Room ${roomID} is full` });
  }

  return res.status(200).json({ available: true, message: `Room ${roomID} found` });
}
