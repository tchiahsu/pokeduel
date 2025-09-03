import React from "react";
import { useRef } from "react";

import { toast } from "sonner";
import { shake } from "../../utils/effects";

interface BattleActionsPanelProps {
  onSelect: (mode: "none" | "attack" | "switch") => void;
  onQuit: () => void;
  isFainted: boolean;
  disabled: boolean;
}

const BattleActionsPanel: React.FC<BattleActionsPanelProps> = ({ onSelect, onQuit, isFainted, disabled }) => {
  const attackButtonRef = useRef<HTMLButtonElement>(null);
  const handleAttackClick = () => {
    if (isFainted) {
      toast.warning("Your Pokemon has fainted! Switch Pokemon");
      shake(attackButtonRef.current);
    } else {
      onSelect("attack");
    }
  };
  return (
    <div className="flex flex-col flex-1 h-full p-4 rounded-lg bg-gray-300/80 justify-center items-center gap-4 text-white">
      {/* Attack Button */}
        <button
          ref={attackButtonRef}
          onClick={handleAttackClick}
          className="w-full py-2 bg-[#FFA500] hover:bg-[#FFA500]/60 rounded-lg flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          ATTACK
        </button>

      {/* Switch Button */}
        <button
          onClick={() => onSelect("switch")}
          className="w-full py-2 bg-[#3B4CCA] hover:bg-[#3B4CCA]/60 rounded-lg flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          SWITCH
        </button>

      {/* Quit Button */}
        <button
          onClick={onQuit}
          className="w-full py-2 bg-[#FF0000] hover:bg-[#FF0000]/60 rounded-lg flex items-center hover:scale-105 justify-center"
        >
          QUIT
        </button>
    </div>
  );
};

export default BattleActionsPanel;
