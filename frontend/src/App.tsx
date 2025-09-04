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

import bg1 from "../assets/bg_3.webp";
import bg2 from "../assets/bg_2.jpg";
import bg3 from "../assets/bg-battle.jpg";
import bg4 from "../assets/bg-dark-forest.jpg";
import bg5 from "../assets/bg-forrest.jpg";
import bg6 from "../assets/bg-park2.jpg";
import bg7 from "../assets/bg-path.jpg";
import bg8 from "../assets/bg-snow.jpg";
import bg9 from "../assets/bg-lava.jpg";


const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const socket: Socket = io(API_URL_BASE);

const bgImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9];

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <BackgroundMusic />
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
    // <TestAnimation pokemon="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/330.png"></TestAnimation>
  );
}
//initial loading component

export default App;
