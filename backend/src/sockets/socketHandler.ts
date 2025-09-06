import { Server } from "socket.io";
import RoomManager from "../services/RoomManager.js";
import BattleModel from "../model/BattleModel.js";

export default function registerSocketHandlers(io: Server, roomManager: RoomManager) {
  //function to check if the game is over
  function checkGameOver(battleModel: BattleModel): boolean {
    if (battleModel.isGameOver()) {
      let winningPlayer: string;
      let winningTeam: string[] = [];

      const player1ID = battleModel.getPlayer1ID();
      const player2ID = battleModel.getPlayer2ID();
      const { player: player1 } = battleModel.getPlayerAndMoveByID(player1ID);
      const { player: player2 } = battleModel.getPlayerAndMoveByID(player2ID);

      if (player1.hasRemainingPokemon()) {
        winningPlayer = player1.getName();
        winningTeam = player1.getTeam().map((pokemon) => pokemon.getFrontSprite());
      } else {
        //player 2 has no remaining pokemon
        winningPlayer = player2.getName();
        winningTeam = player2.getTeam().map((pokemon) => pokemon.getFrontSprite());
      }
      const message = `${winningPlayer} has won!`;

      io.to(player1ID).emit("gameOver", { message, team: winningTeam });
      io.to(player2ID).emit("gameOver", { message, team: winningTeam });
      return true;
    }

    return false;
  }

  //function to handle if one opponent quits
  function handlePlayerQuit(socketID: string) {
    const roomID: string = roomManager.getPlayerRoom(socketID);
    const battleModel: BattleModel = roomManager.getBattleModel(roomID);
    roomManager.removePlayerFromRoom(socketID);

    if (battleModel && battleModel.hasTwoPlayers()) {
      const remainingPlayer =
        socketID === battleModel.getPlayer1ID() ? battleModel.getPlayer2ID() : battleModel.getPlayer1ID();
      io.to(remainingPlayer).emit("endGame", {
        message: `Opponent has disconnected`,
      });
      roomManager.deleteRoom(roomID);
      console.log(`Room ${roomID} deleted`);
    } else if (roomManager.isWaitingRoomEmpty(roomID) || roomManager.isSinglePlayerRoom(roomID)) {
      roomManager.deleteRoom(roomID);
      console.log(`Room ${roomID} deleted`);
    }
  }

  io.on("connection", (socket) => {
    console.log(`Player ${socket.id} has connected`);

    // Join room as soon as the player connects
    socket.on("joinRoom", async (roomID) => {
      socket.join(roomID);
      roomManager.addPlayerToRoom(socket.id, roomID);
      if (roomManager.isSinglePlayerRoom(roomID)) {
        const battleModel: BattleModel = roomManager.getBattleModel(roomID);
        await battleModel.addBotPlayer();
      }
      socket.emit("joinRoom", { message: `Joined room ${roomID}` });
    });

    // Event to set the player
    socket.on("setPlayer", async (data) => {
      const roomID: string = roomManager.getPlayerRoom(socket.id);
      const battleModel: BattleModel = roomManager.getBattleModel(roomID);
      await battleModel.setPlayer(socket.id, data.name, data.teamSelection);

      // Begin the game if there are two players
      if (battleModel.hasTwoPlayers()) {
        console.log(`Room ${roomID}'s battle has begun`);
        const player1ID = battleModel.getPlayer1ID();
        const player2ID = battleModel.getPlayer2ID();

        const startSummary = battleModel.getStartSummary();
        io.to(player1ID).emit("gameStart", startSummary[player1ID]);
        io.to(player2ID).emit("gameStart", startSummary[player2ID]);

        const currentState = battleModel.getCurrentState();
        const nextOptions = battleModel.getNextOptions();

        io.to(player1ID).emit("currentState", currentState[player1ID]);
        io.to(player2ID).emit("currentState", currentState[player2ID]);

        io.to(player1ID).emit("nextOptions", nextOptions[player1ID]);
        io.to(player2ID).emit("nextOptions", nextOptions[player2ID]);
      } else {
        io.to(socket.id).emit("waitingForPlayer", { message: "Waiting for opponent to join..." });
      }
    });

    // Event to submit move
    socket.on("submitMove", (playerMove) => {
      const roomID: string = roomManager.getPlayerRoom(socket.id);
      const battleModel: BattleModel = roomManager.getBattleModel(roomID);
      battleModel.addMove(socket.id, playerMove);

      if (roomManager.isSinglePlayerRoom(roomID)) {
        battleModel.addBotAttackMove();
        // checkGameOver(battleModel, io);
      }

      if (battleModel.isReadyToHandleTurn()) {
        battleModel.handleTurn();
        const turnSummary = battleModel.getTurnSummary();
        const player1ID = battleModel.getPlayer1ID();
        const player2ID = battleModel.getPlayer2ID();

        // Send turn summary to each player
        io.to(player1ID).emit("turnSummary", turnSummary[player1ID]);
        io.to(player2ID).emit("turnSummary", turnSummary[player2ID]);

        if (checkGameOver(battleModel)) return;

        // Check if someone has fainted
        if (battleModel.hasFaintedPlayers()) {
          const [faintedPlayer1, faintedPlayer2] = battleModel.getFaintedPlayers();

          // Handle fainting for a single player room
          if (roomManager.isSinglePlayerRoom(roomID)) {
            if (faintedPlayer1 && faintedPlayer2) {
              if (battleModel.isBotPlayer(faintedPlayer1)) {
                const { player: botPlayer } = battleModel.getPlayerAndMoveByID(faintedPlayer1);
                io.to(faintedPlayer2).emit("requestFaintedSwitch", battleModel.getSwitchOptions(faintedPlayer2));

                botPlayer.hasRemainingPokemon() ? battleModel.addBotSwitchMove() : checkGameOver(battleModel);
              } else {
                io.to(faintedPlayer1).emit("requestFaintedSwitch", battleModel.getSwitchOptions(faintedPlayer1));
                const { player: botPlayer } = battleModel.getPlayerAndMoveByID(faintedPlayer2);
                if (botPlayer.hasRemainingPokemon()) {
                  battleModel.addBotSwitchMove();
                } else {
                  checkGameOver(battleModel);
                }
              }
              // battleModel.addBotSwitchMove();
              // checkGameOver(battleModel, io);
            } else {
              if (battleModel.isBotPlayer(faintedPlayer1)) {
                const { player: botPlayer } = battleModel.getPlayerAndMoveByID(faintedPlayer1);
                if (botPlayer.hasRemainingPokemon()) {
                  const alivePlayer = battleModel.getOppositePlayer(faintedPlayer1);
                  io.to(alivePlayer).emit("waitForFaintedSwitch", {
                    message: `Waiting for other player to switch pokemon`,
                  });
                  battleModel.addBotSwitchMove();
                  battleModel.handleFaintedSwitch();
                  const turnSummary = battleModel.getTurnSummary();
                  io.to(alivePlayer).emit("turnSummary", turnSummary[alivePlayer]);
                } else {
                  checkGameOver(battleModel);
                }
              } else {
                const alivePlayer = battleModel.getOppositePlayer(faintedPlayer1);
                io.to(faintedPlayer1).emit("requestFaintedSwitch", battleModel.getSwitchOptions(faintedPlayer1));
                io.to(alivePlayer).emit("waitForFaintedSwitch", {
                  message: `Waiting for other player to switch pokemon`,
                });
              }
            }
            return;
          }

          // Handle fainting for a multiplayer room
          if (faintedPlayer1 && faintedPlayer2) {
            io.to(faintedPlayer1).emit("requestFaintedSwitch", battleModel.getSwitchOptions(faintedPlayer1));
            io.to(faintedPlayer2).emit("requestFaintedSwitch", battleModel.getSwitchOptions(faintedPlayer2));
          } else {
            io.to(faintedPlayer1).emit("requestFaintedSwitch", battleModel.getSwitchOptions(faintedPlayer1));
            const alivePlayer = battleModel.getOppositePlayer(faintedPlayer1);
            io.to(alivePlayer).emit("waitForFaintedSwitch", {
              message: `Waiting for other player to switch pokemon`,
            });
          }
          return;
        }
      }
    });

    // Event to return the current state of the game (current pokemon used and the next options for the player)
    socket.on("requestState", () => {
      // Send out the new state and the next options to the player
      const roomID: string = roomManager.getPlayerRoom(socket.id);
      const battleModel: BattleModel = roomManager.getBattleModel(roomID);
      const playerID = socket.id;

      const currentState = battleModel.getCurrentState();
      const nextOptions = battleModel.getNextOptions();
      io.to(playerID).emit("currentState", currentState[playerID]);
      io.to(playerID).emit("nextOptions", nextOptions[playerID]);
    });

    // Event to handle a fainted switch
    socket.on("submitFaintedSwitch", (playerMove) => {
      const roomID: string = roomManager.getPlayerRoom(socket.id);
      const battleModel: BattleModel = roomManager.getBattleModel(roomID);
      battleModel.addMove(socket.id, playerMove);
      if (battleModel.isReadyToHandleFaintedSwitch()) {
        battleModel.handleFaintedSwitch();
        const turnSummary = battleModel.getTurnSummary();
        const player1ID = battleModel.getPlayer1ID();
        const player2ID = battleModel.getPlayer2ID();

        // Send turn summary to each player
        io.to(player1ID).emit("turnSummary", turnSummary[player1ID]);
        io.to(player2ID).emit("turnSummary", turnSummary[player2ID]);

        checkGameOver(battleModel);
      }
    });

    // Event to handle disconnect
    socket.on("disconnect", () => {
      handlePlayerQuit(socket.id);
    });

    // Event to handle disconnect
    socket.on("quitGame", () => {
      handlePlayerQuit(socket.id);
    });
  });
}
