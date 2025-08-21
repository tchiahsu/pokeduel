import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import homeBg from "../assets/bg-forrest.jpg";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import { useSocket } from "../contexts/SocketContext";
import { toast } from "sonner";
import { shake } from "../utils/shake";

export default function SinglePlayer() {
  const API_URL_BASE = "http://localhost:8000/room";
  const [playerName, setPlayerName] = useState("");
  const [roomID, setRoomID] = useState("");
  const socket = useSocket();
  const startRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

  // Handles creating a new roomID
  const createRoomID = async () => {
    try {
      if (!playerName) {
        shake(startRef.current);
        toast.error("Please enter your name.")
        return;
      }

      const response = await fetch(API_URL_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSinglePlayer: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      setRoomID(data.id);
      socket.emit("joinRoom", data.id);
    } catch (error) {
      console.error("Error creating room: ", error);
      alert("Failed to create room. Please try again.");
    }
    
    navigate("/team-selection", { state: { playerName } });
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
    }
  };

  return (
    <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
      <img
        src={homeBg}
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
        alt="background"
      />

      <div className="relative gap-5 flex flex-col items-center select-none">
        <h3 className="text-3xl pokemon-h3 m-5 text-center">Solo Battle</h3>
        <h1 className="text-8xl pb-6 tracking-[-8px] pokemon-h1">PokeDuel</h1>
      </div>

      <div className="relative inset-x-0 inset-y-0">
        <div className="flex flex-col gap-6 items-center justify-center">
          <InputBox placeholder="Enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <div className="flex gap-2">
            <Link to="/">
              <Button onClick={handleDeleteRoom}>Back to Home</Button>
            </Link>
            <span ref={startRef}>
              <Button onClick={createRoomID} disabled={!playerName}>
                Start Game
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
