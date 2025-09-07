import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import RoomManager from "./services/RoomManager.js";
import createRoomRouter from "./routes/roomRoutes.js";
import pokemonRouter from "./routes/pokemonRoutes.js";
import moveRouter from "./routes/moveRoutes.js";
import registerSocketHandlers from "./sockets/socketHandler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8000;

const roomManager: RoomManager = new RoomManager();

app.use(express.json());
app.use(cors());
app.use("/room", createRoomRouter(roomManager));
app.use("/pokemon", pokemonRouter);
app.use("/moves", moveRouter);

app.get("/health", (_req, res) => res.status(200).send("ok"));
app.post("/warmup", async (_req, res) => {
  res.status(200).send("warm");
})

server.listen(PORT, () => {
  console.log(`Server running on Render at port ${PORT}`);
});

registerSocketHandlers(io, roomManager);
