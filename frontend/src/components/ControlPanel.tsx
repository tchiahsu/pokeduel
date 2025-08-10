import React, { useState } from 'react';

type Mode = 'menu' | 'switch';

interface Pokemon {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
}

interface Move {
  name: string;
  type: string;
  pp: number;
  maxPp: number;
}

interface ControlPanelProps {
  team: Pokemon[];
  moves: Move[];
}

const typeColorMap: Record<string, string> = {
  normal: 'bg-gray-300/80',
  fire: 'bg-red-400/80',
  water: 'bg-blue-400/80',
  electric: 'bg-yellow-300/80',
  grass: 'bg-green-400/80',
  ice: 'bg-blue-100/80',
  fighting: 'bg-orange-500/80',
  poison: 'bg-purple-400/80',
  ground: 'bg-yellow-600/80',
  flying: 'bg-indigo-300/80',
  psychic: 'bg-pink-500/60',
  bug: 'bg-lime-400/80',
  rock: 'bg-yellow-700/60',
  ghost: 'bg-violet-900/50',
  dragon: 'bg-indigo-500/80',
  dark: 'bg-gray-700/80',
  steel: 'bg-slate-400/80',
  fairy: 'bg-fuchsia-300/80',
};

const ControlPanel: React.FC<ControlPanelProps> = ({ team, moves }) => {
  const [mode, setMode] = useState<Mode>('menu');
  const [movesActive, setMovesActive] = useState(false);

  return (
    <div className="absolute bottom-6 left-146 transform -translate-x-1/2 w-280 h-50 p-4 bg-gray-300/90 border-2 border-gray-700 rounded-lg shadow-xl z-20">
      {/* Menu Mode */}
      {mode === 'menu' && (
        <div className="flex flex-row gap-5 m-4">
          <div className="flex flex-col justify-center gap-5">
            <button
              className="bg-gray-400 hover:bg-gray-300 border-2 border-black rounded-md px-6 py-3 text-xl"
              onClick={() => setMovesActive(true)}
              disabled={movesActive}
            >
              Attack
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-300 border-2 border-black rounded-md px-6 py-3 text-xl"
              onClick={() => {
                setMode('switch');
                setMovesActive(false);
              }}
            >
              Switch
            </button>
          </div>
          {/* Grayed-out move previews */}
          <div className={`grid grid-cols-2 gap-2 ${movesActive ? '' : 'opacity-50 pointer-events-none'}`}>
            {moves.map((move, i) => {
              const bgColor = typeColorMap[move.type.toLowerCase()] || 'bg-gray-200';
              return (
                <button
                  key={i}
                  className={`pl-26 pr-26 border-2 border-gray-700 rounded-lg text-center font-bold text-gray-700 ${bgColor} hover:brightness-110 transition duration-200`}
                  onClick={() => console.log(`Used ${move.name}`)}
                  disabled={!movesActive}
                >
                  <div>{move.name}</div>
                  <div className="text-sm text-gray-200">{move.pp}/{move.maxPp} PP</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Switch Mode */}
      {mode === 'switch' && (
        <div>
          <button
            onClick={() => {
                setMode('menu');
                setMovesActive(false);
            }}
            className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 border border-black rounded"
          >
            &larr; Return
          </button>
          <div className="grid grid-cols-3 gap-2">
            {team.map((poke, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  poke.hp <= 0
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-green-100 border-green-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={poke.image} alt={poke.name} className="w-6 h-6" />
                  <span className="font-bold">{poke.name}</span>
                </div>
                <span className="font-bold">{poke.hp}/{poke.maxHp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;