import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Home from './pages/Home';
import Multiplayer from './pages/Multiplayer';
import Selection from './pages/Selection';
import Battle from './pages/Battle';
import './App.css'

function App() {
  const API_URL_BASE = 'http://localhost:8000';
  
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  type Pokemon = {
    name: string;
    sprite: string;
  };

  // Fetch the pokemon into the frontend
  useEffect(() => {
      async function fetchPokemon() {
          try {
              const res = await fetch(`${API_URL_BASE}/get-default-pokemon`);
              const data = await res.json();
              setPokemonList(data);
          } catch (e) {
              console.error('Error fetching default Pokemon:', e);
          }
      }
      fetchPokemon();
  }, []);
  
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/team-selection" element={<Selection list={pokemonList}/>} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
//initial loading component

export default App
