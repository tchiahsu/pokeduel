import express from "express";
import { Router } from "express";
import RoomManager from "../services/RoomManager.js";
import { createRoom, deleteRoom, getRoom } from "../controllers/roomControllers.js";

/**
 * Creates a router for handling room-related endpoints.
 *
 * This router exposes:
 * - POST /room         Create a new room
 * - DELETE /room/:id   Delete an existing room by ID
 * - GET /room/:id      Check if a room is available (exists and is not full)
 *
 * @param roomManager The RoomManager instance that handles room creation, deletion, and lookup.
 * @returns An Express router configured with the room routes.
 */
export default function createRoomRouter(roomManager: RoomManager): Router {
  const router = express.Router();
  router.post("/", (req, res) => createRoom(req, res, roomManager));
  router.delete("/:id", (req, res) => deleteRoom(req, res, roomManager));
  router.get("/:id", (req, res) => getRoom(req, res, roomManager));
  return router;
}
