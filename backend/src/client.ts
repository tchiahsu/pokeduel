import io from "socket.io-client";

const socket = io("http://localhost:5000/");

socket.on("connect", () => {
  console.log(`Connected as ${socket.id}`);
});

// socket.emit("start-game", { message: "test" });

socket.emit("submit-turn");
