import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Multiplayer from './pages/Multiplayer';
import Selection from './pages/Selection';
import Battle from './pages/Battle';
import './App.css'

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/team-selection" element={<Selection />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App
