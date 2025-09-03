import React from "react";
import { toast } from "sonner";

/**
 * Represents a Pokemon in the Player's Team.
 */
interface Pokemon {
  name: string;
  hp: number;
  maxHP: number;
  backSprite: string;
  frontSprite: string;
}

/**
 * Represents a move of a Pokemon.
 */
interface Move {
  name: string;
  type: string;
  pp: number;
  maxPP: number;
}

/**
 * Props for the BattleDisplayPanel component.
 */
interface BattleDisplayPanelProps {
  mode: "none" | "attack" | "switch" | "faint";
  moves: Move[];
  team: Pokemon[];
  status?: string;
  currentPokemon: string;
  onMoveSelect?: (index: number) => void;
  onSwitchSelect?: (index: number) => void;
}

/**
 * Maps types to background color.
 */
const typeColorMap: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-300",
  water: "bg-blue-300",
  electric: "bg-yellow-200",
  grass: "bg-green-300",
  ice: "bg-blue-100",
  fighting: "bg-orange-400",
  poison: "bg-purple-300",
  ground: "bg-yellow-500",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-400",
  rock: "bg-yellow-700",
  ghost: "bg-violet-900",
  dragon: "bg-indigo-500",
  dark: "bg-gray-700",
  steel: "bg-slate-400",
  fairy: "bg-fuchsia-300",
};

const BattleDisplayPanel: React.FC<BattleDisplayPanelProps> = ({
  mode,
  moves,
  team,
  status,
  currentPokemon,
  onMoveSelect,
  onSwitchSelect,
}) => {
  /**
   * Render move buttons for current Pokemon.
   * @returns
   */
  const renderMoves = () => (
    <div className="grid grid-cols-2 gap-2 place-items-center justify-items-stretch">
      {moves.map((move, i) => {
        var bgColor = typeColorMap[move.type?.toLowerCase?.() || "normal"] || "bg-gray-200";
        var displayName = move.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        return (
          <button
            key={i}
            onClick={() => {
              if (move.pp === 0) {
                toast.warning(`You can't use this ability anymore! You have ran out of power points for this move!`);
                return;
              }
              onMoveSelect?.(i)
            }}
            className={`p-2 mt-2 w-full border border-gray-700 rounded ${bgColor} text-white font-bold hover:brightness-110`}
          >
            <div className="select-none">{displayName}</div>
            <div className="text-sm select-none">
              {move.pp}/{move.maxPP} PP
            </div>
          </button>
        );
      })}
    </div>
  );

  /**
   * Renders a grid of Pokemon to switch to in the team.
   */
  const renderSwitches = () => (
    <div className="grid grid-cols-3 gap-1 place-items-center h-full">
      {team.map((poke, i) => (
        <button
          key={i}
          onClick={() => {
            if (poke.hp <= 0) {
              toast.warning(`${poke.name} has fainted! Select another Pokemon`);
              return;
            }
            if (poke.name === currentPokemon) {
              toast.error("Cannot switch to current Pokemon");
              return;
            }
            onSwitchSelect?.(i);
          }}
          className={`flex w-80 items-center justify-between p-3 border rounded-md ${
            poke.hp <= 0 ? "bg-gray-200 text-gray-500" : "bg-green-100 border-green-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {poke.frontSprite && <img src={poke.frontSprite} alt={poke.name} className="w-6 h-6" />}
            <span className="font-bold select-none">{poke.name}</span>
          </div>
          <span className="font-bold select-none">
            {poke.hp}/{poke.maxHP}
          </span>
        </button>
      ))}
    </div>
  );

  /**
   * Renders a status message.
   */
  const renderStatus = () => (
    <div className="text-gray-600 flex justify-left items-center h-full text-xl italic select-none pointer-events-none">
      {status}
    </div>
  );

  return (
    <div className="flex-1 h-full bg-gray-300/80 rounded-lg p-4">
      {mode === "attack" && renderMoves()}
      {(mode === "switch" || mode == "faint") && renderSwitches()}
      {mode === "none" && renderStatus()}
    </div>
  );
};

export default BattleDisplayPanel;
