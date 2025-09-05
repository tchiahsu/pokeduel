import React from "react";
import { toast } from "sonner";
import { removeHyphen } from "../../utils/helpers";

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
  currentPokemon: string | undefined;
  onMoveSelect?: (index: number) => void;
  onSwitchSelect?: (index: number) => void;
}

/**
 * Maps types to background color.
 */
const typeColorMap: Record<string, string> = {
  normal: "bg-gray-300",
  fire: "bg-orange-500",
  water: "bg-sky-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-600",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-600",
  bug: "bg-lime-600",
  rock: "bg-stone-600",
  ghost: "bg-violet-800",
  dragon: "bg-indigo-700",
  dark: "bg-neutral-800",
  steel: "bg-slate-500",
  fairy: "bg-pink-300",
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
    <div className="grid grid-cols-2 gap-4 place-items-center justify-items-stretch">
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
              onMoveSelect?.(i);
            }}
            className={`p-2 w-full shadow-lg rounded ${bgColor} text-white font-bold hover:brightness-110 cursor-pointer hover:scale-102 active:scale-98`}
          >
            <div className="flex flex-col">
              <div className="flex justify-start select-none">{displayName}</div>
              <div className="flex flex-row justify-between">
                <div className="flex">{move.type}</div>
                <div className="flex text-sm select-none">
                  {move.pp}/{move.maxPP} PP
                </div>
              </div>
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
    <div className="grid grid-cols-3 gap-3 place-items-center h-full text-sm">
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
          className={`flex w-full items-center justify-between gap-5 p-3 rounded-md flex-row hover:scale-102 active:scale-98 shadow-lg ${
            poke.hp <= 0 ? "bg-gray-300 text-gray-500" : "bg-green-100"
          }`}
        >
          {/* Button Content */}
          <div className="flex items-center gap-2">
            {poke.frontSprite && <img src={poke.frontSprite} alt={poke.name} className="h-full w-auto max-w-10" />}
          </div>
          <span className="flex font-bold select-none overflow-hidden whitespace-nowrap">
            {removeHyphen(poke.name)}
          </span>
          <span className="text-sm">
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
    <div className="flex flex-col text-gray-600 justify-center items-start text-xl italic select-none pointer-events-none h-full">
      {status?.split("\n").map((line) => (
        <p key={line}>{line}</p>
      ))}
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
