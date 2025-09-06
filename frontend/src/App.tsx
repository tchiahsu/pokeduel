import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { io, Socket } from "socket.io-client";
import { preloadImg } from "./utils/helpers";

import Home from "./pages/Home";
import Multiplayer from "./pages/Multiplayer";
import SinglePlayer from "./pages/SinglePlayer";
import Selection from "./pages/Selection";
import Battle from "./pages/Battle";
import { SocketContext } from "./contexts/SocketContext";
import "./App.css";
import type { Pokemon } from "./types/pokemon";
import BackgroundMusic from "./components/BackgroundMusic";
import UtilityButton from "./components/UtilityButton";
import InstructionsPopup from './components/InstructionPopUp';
import { IoInformation, IoVolumeMute, IoVolumeHigh } from "react-icons/io5";

import bg1 from "./assets/bg_3.webp";
import bg2 from "./assets/bg_2.jpg";
import bg3 from "./assets/bg-snow.jpg";


const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const socket: Socket = io(API_URL_BASE);

const bgImages = [bg1, bg2, bg3];

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [muted, setMuted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false); 

  const openInstructions = () => {
        setShowInstructions(true);
  };

  const closeInstructions = () => {
        setShowInstructions(false);
  };
    
  const toggleMute = () => {
    setMuted(!muted);
  }

  // Fetch the pokemon into the frontend
  useEffect(() => {
    preloadImg(bgImages);
    async function fetchPokemon() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL_BASE}/pokemon/default`);
        const data = await res.json();
        setPokemonList(data);
      } catch (e) {
        console.error("Error fetching default Pokemon:", e);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPokemon();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <HashRouter>
        <Toaster position="top-center" />
        {!muted && <BackgroundMusic unmute={setMuted}/>}
        {/* Utility Buttons */}
        <div className="hidden md:flex absolute top-0 right-0 m-10 gap-4 z-200">
            {/* Information Button */}
            <UtilityButton onClick={openInstructions}><IoInformation className="w-full h-auto p-1" /></UtilityButton>
            {/* Sound Button */}
            <UtilityButton onClick={toggleMute} hoverColor={muted ? "blue" : "red"}>
                {muted ? <IoVolumeMute className="w-full h-auto p-2" /> : <IoVolumeHigh className="w-full h-auto p-2" />}
            </UtilityButton>
            {showInstructions && <InstructionsPopup onClose={closeInstructions} />}
        </div>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/multiplayer" element={<Multiplayer />} />
            <Route path="/team-selection/:roomId" element={<Selection list={pokemonList} loading={isLoading} />} />
            <Route path="/battle/:roomId" element={<Battle />} />
            <Route path="/single-player" element={<SinglePlayer />} />
          </Routes>
        </div>
      </HashRouter>
    </SocketContext.Provider>
  );
}

export default App;
