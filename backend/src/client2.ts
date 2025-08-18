import io from "socket.io-client";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = io("http://localhost:8000/");

const roomID = process.argv[2];

async function gameRoomTest() {
  const response: Response = await fetch(`http://localhost:8000/room/${roomID}`);
  const responseJSON = await response.json();
  if (responseJSON.available) {
    socket.on("connect", () => {
      console.log(`Connected as ${socket.id}`);
    });

    socket.emit("joinRoom", roomID);

    socket.on("joinRoom", (data) => {
      console.log(data.message);
    });

    socket.emit("setPlayer", {
      name: "Pham",
      teamSelection: {
        alakazam: ["psychic", "shadow-ball", "recover", "calm-mind"],
        machamp: ["dynamic-punch", "earthquake", "stone-edge", "bulk-up"],
      },
    });
  } else {
    console.log(responseJSON.message);
  }

  socket.on("currentState", (data) => {
    console.log(data);
  });

  function getMove() {
    rl.question("Enter your move: ", (input) => {
      const move = JSON.parse(input);
      socket.emit("submitMove", move);
    });
  }

  socket.on("turnSummary", (data) => {
    console.log(data);
  });

  socket.on("nextOptions", (data) => {
    console.log(data);
    getMove();
  });

  function getFaintedSwitchMove() {
    rl.question("Enter a Pokemon to switch to: ", (input) => {
      const move = JSON.parse(input);
      socket.emit("submitFaintedSwitch", move);
    });
  }

  socket.on("requestFaintedSwitch", (data) => {
    console.log(data);
    getFaintedSwitchMove();
  });

  socket.on("waitForFaintedSwitch", (data) => {
    console.log(data.message);
  });
}

gameRoomTest();
