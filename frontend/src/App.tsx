import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Home from "./pages/Home";
import Multiplayer from "./pages/Multiplayer";
import SinglePlayer from "./pages/SinglePlayer";
import Selection from "./pages/Selection";
import Battle from "./pages/Battle";
import { SocketContext } from "./contexts/SocketContext";
import "./App.css";

const API_URL_BASE = "http://localhost:8000";
const socket: Socket = io(API_URL_BASE);

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  type Pokemon = {
    name: string;
    sprite: string;
  };

  // Fetch the pokemon into the frontend
  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch(`${API_URL_BASE}/pokemon/default`);
        const data = await res.json();
        setPokemonList(data);
      } catch (e) {
        console.error("Error fetching default Pokemon:", e);
      }
    }
    fetchPokemon();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <HashRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/multiplayer" element={<Multiplayer />} />
            <Route path="/team-selection" element={<Selection list={pokemonList} />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/single-player" element={<SinglePlayer />} />
          </Routes>
        </div>
      </HashRouter>
    </SocketContext.Provider>
  );
}
//initial loading component

export default App;
