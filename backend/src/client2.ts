import io from "socket.io-client";

const socket = io("http://localhost:5000/");

socket.on("connect", () => {
  console.log(`Connected as ${socket.id}`);
});

socket.on("update-game", (data) => {
  console.log(data.message);
});

socket.emit("setPlayer", {
  name: "Pham",
  teamSelection: {
    alakazam: ["psychic", "shadow ball", "recover", "calm mind"],
    machamp: ["dynamic punch", "earthquake", "stone edge", "bulk up"],
  },
});

socket.emit("submitMove", { action: "switch", index: 2 });
