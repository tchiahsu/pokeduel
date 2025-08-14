import React from 'react';

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

interface BattleDisplayPanelProps {
  mode: 'none' | 'attack' | 'switch';
  moves: Move[];
  team: Pokemon[];
}

// Background color can be modified - can separately go in services too
const typeColorMap: Record<string, string> = {
  normal: 'bg-gray-200',
  fire: 'bg-red-300',
  water: 'bg-blue-300',
  electric: 'bg-yellow-200',
  grass: 'bg-green-300',
  ice: 'bg-blue-100',
  fighting: 'bg-orange-400',
  poison: 'bg-purple-300',
  ground: 'bg-yellow-500',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-400',
  rock: 'bg-yellow-700',
  ghost: 'bg-violet-900',
  dragon: 'bg-indigo-500',
  dark: 'bg-gray-700',
  steel: 'bg-slate-400',
  fairy: 'bg-fuchsia-300',
};

const BattleDisplayPanel: React.FC<BattleDisplayPanelProps> = ({ mode, moves, team }) => {
  return (
    <div className="w-258 h-50 bg-gray-300/80 rounded-lg p-4">
      {mode === 'attack' && (
        <div className="grid grid-cols-2 gap-2 place-items-center justify-items-stretch">
          {moves.map((move, i) => {
            const bgColor = typeColorMap[move.type.toLowerCase()] || 'bg-gray-200';
            return (
              <button
                key={i}
                className={`p-2 mt-2 w-full border border-gray-700 rounded ${bgColor} text-white font-bold hover:brightness-110`}
                onClick={() => console.log(`Used ${move.name}`)}
              >
                <div>{move.name}</div>
                <div className="text-sm">{move.pp}/{move.maxPp} PP</div>
              </button>
            );
          })}
        </div>
      )}

      {mode === 'switch' && (
        <div className="grid grid-cols-3 gap-1 place-items-center h-full">
          {team.map((poke, i) => (
            <div
              key={i}
              className={`flex w-80 items-center justify-between p-3 border rounded-md ${
                poke.hp <= 0
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-green-100 border-green-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {poke.image && <img src={poke.image} alt={poke.name} className="w-6 h-6" />}
                <span className="font-bold">{poke.name}</span>
              </div>
              <span className="font-bold">{poke.hp}/{poke.maxHp}</span>
            </div>
          ))}
        </div>
      )}
      {/* To be modified */}
      {mode === 'none' && (
        <div className="text-gray-600 mt-18 text-left text-xl italic select-none pointer-events-none">Select an action to begin...</div>
      )}
      {/* Functionality for Quit to be added */}
    </div>
  );
};

export default BattleDisplayPanel;
