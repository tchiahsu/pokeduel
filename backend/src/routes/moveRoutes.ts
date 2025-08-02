import express from "express";
import { getMoveData } from "../controllers/movesControllers.js";
const router = express.Router();

// Get the data for a move
// GET /moves/:name
router.get("/:name", getMoveData);

export default router;
