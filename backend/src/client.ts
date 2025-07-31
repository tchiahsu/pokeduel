import io from "socket.io-client";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = io("http://localhost:8000/");

async function gameRoomTest() {
  const response: Response = await fetch("http://localhost:8000/room", {
    method: "POST",
  });
  const roomJSON: Record<string, string> = await response.json();
  const roomID: string = roomJSON.id;

  socket.on("connect", () => {
    console.log(`Connected as ${socket.id}`);
  });

  socket.emit("joinRoom", roomID);

  socket.on("joinRoom", (data) => {
    console.log(data.message);
  });

  socket.emit("setPlayer", {
    name: "Harrison",
    teamSelection: {
      charizard: ["flamethrower", "air-slash", "dragon-claw", "earthquake"],
      blastoise: ["hydro-pump", "ice-beam", "surf", "bite"],
    },
  });

  socket.on("gameStart", () => {
    getMove();
  });

  function getMove() {
    rl.question("Enter your move: ", (input) => {
      const move = JSON.parse(input);
      socket.emit("submitMove", move);
    });
  }

  socket.on("turnSummary", (data) => {
    console.log(data);
    getMove();
  });
}

gameRoomTest();
