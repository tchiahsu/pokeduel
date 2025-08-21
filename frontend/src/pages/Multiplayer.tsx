import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import homeBg from "../assets/bg-forrest.jpg";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import { toast } from "sonner";
import { shake } from "../utils/effects";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

export default function Multiplayer() {
  const API_URL_BASE = "http://localhost:8000/room";
  const [playerName, setPlayerName] = useState("");
  const [roomID, setRoomID] = useState("");
  const [mode, setMode] = useState<"create" | "join" | null>(null);
  const navigate = useNavigate();
  const socket = useSocket();
  const joinRef = useRef<HTMLSpanElement>(null);
  const createRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef<HTMLSpanElement>(null);

  // Handles creating a new roomID
  const createRoomID = async () => {
    try {
      if (!playerName) {
        shake(createRef.current);
        toast.error("Please enter you name before creating a game.");
        return;
      }

      const response = await fetch(API_URL_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSinglePlayer: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      setRoomID(data.id);
      setMode("create");
    } catch (error) {
      console.error("Error creating room: ", error);
      alert("Failed to create room. Please try again.");
    }
  };

  // Handles setting the mode
  const handleJoinMode = async () => {
    if (!playerName) {
      shake(joinRef.current);
      toast.error("Please enter you name before joining a game.");
      return;
    }
    setMode("join");
  }

  // Handles when a user clicks "START GAME"
  const handleStartGame = async () => {
    if (!roomID) {
      shake(startRef.current);
      toast.error("Please insert a valid Room ID");
      return;
    }

    if (mode === "join") {
      try {
        const response = await fetch(`http://localhost:8000/room/${roomID}`);

        if (!response.ok) {
          const data = await response.json();
          alert(data.message || "Room not found");
          return;
        }
      } catch (error) {
        console.error("Error joining room:", error);
        alert("Failed to join room");
        return;
      }
    }

    socket.emit("joinRoom", roomID);
    navigate(`/team-selection/${roomID}`, { state: { playerName } });
  };

  // Handles deleting a room
  const handleDeleteRoom = async () => {
    try {
      const response = await fetch(`${API_URL_BASE}/${roomID}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        console.log("Server responded with error:", data.message);
      }
    } catch (error) {
      console.error("Error deleting room");
    } finally {
      setRoomID("");
      setMode(null);
    }
  };

  // Handles when a user clicks Leave button in join mode
  const handleLeaveRoom = () => {
    setRoomID("");
    setMode(null);
  };

  // Copy the text to system
  const copy = () => {
    navigator.clipboard.writeText(roomID);
    alert("RoomID copied!");
  };

  return (
    <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
      <img
        src={homeBg}
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
        alt="background"
      />

      <div className="relative gap-5 flex flex-col items-center select-none">
        <h3 className="text-3xl pokemon-h3 m-5 text-center">Multiplayer</h3>
        <h1 className="text-8xl pb-6 tracking-[-8px] pokemon-h1">PokeDuel</h1>
      </div>

      <div className="relative inset-x-0 inset-y-0">
        <div className="flex flex-col gap-6 items-center justify-center">
          {mode === null && (
            <InputBox
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          )}

          {mode === null && (
            <div className="flex gap-2">
              <Link to="/">
                <Button>Back to Home</Button>
              </Link>
              <span ref={createRef}>
                <Button onClick={createRoomID} disabled={!playerName}>
                  Create Room
                </Button>
              </span>
              <span ref={joinRef}>
                <Button onClick={handleJoinMode} disabled={!playerName}>
                  Join Room
                </Button>
              </span>
            </div>
          )}

          {mode === "create" && (
            <div className="flex flex-col items-center gap-1 pb-5">
              <p className="text-gray-700 p-7 select-none">Share the code to battle your friends!</p>
              <div className="flex items-center gap-2">
                <span className="bg-gray-200 border-2 border-gray-400 rounded-lg py-2 px-20 text-gray-700">
                  {roomID}
                </span>
                <button
                  onClick={copy}
                  className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue"
                >
                  Copy
                </button>
                <button
                  onClick={handleDeleteRoom}
                  className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue"
                >
                  Leave
                </button>
              </div>
            </div>
          )}

          {mode === "join" && (
            <div className="flex gap-2">
              <InputBox placeholder="Enter Room ID" value={roomID} onChange={(e) => setRoomID(e.target.value)} />
              <button
                onClick={handleLeaveRoom}
                className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue"
              >
                Leave
              </button>
            </div>
          )}
        </div>
        <div className="pt-6">
          {mode != null && (
            <span ref={startRef}>
              <Button onClick={handleStartGame} disabled={!roomID}>
                Start Game
              </Button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
