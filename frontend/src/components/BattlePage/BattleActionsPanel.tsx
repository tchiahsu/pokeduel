import React from 'react';
import { useRef } from 'react';

import { GiMineExplosion } from "react-icons/gi";
import { RiExchange2Line } from "react-icons/ri";
import { IoMdExit } from "react-icons/io";
import { toast } from 'sonner';
import { shake } from "../../utils/effects";

interface BattleActionsPanelProps {
  onSelect: (mode: 'none' | 'attack' | 'switch') => void;
  onQuit: () => void;
  isFainted: boolean;
}

const BattleActionsPanel: React.FC<BattleActionsPanelProps> = ({ onSelect, onQuit, isFainted }) => {
  const attackButtonRef = useRef<HTMLButtonElement>(null);
  const handleAttackClick = () => {
    if (isFainted) {
      toast.warning("Your Pokemon has fainted! Switch Pokemon");
      shake(attackButtonRef.current);
    } else {
      onSelect("attack");
    }
  }
  return (
    <div className="flex flex-col flex-1 h-full p-4 rounded-lg bg-gray-300/80 justify-center items-center gap-4">
      
      {/* Attack Button */}
      <div className="relative group">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ATTACK
        </div>
        <button
        ref={attackButtonRef}
          onClick={handleAttackClick}
          className="w-13 h-13 bg-[#FFA500]/80 hover:bg-gray-500/80 rounded-full flex items-center justify-center"
        >
          <GiMineExplosion className="text-white text-3xl" />
        </button>
      </div>

      {/* Switch Button */}
      <div className="relative group">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          SWITCH
        </div>
        <button
          onClick={() => onSelect('switch')}
          className="w-13 h-13 bg-[#3B4CCA]/80 hover:bg-gray-500/80 rounded-full flex items-center justify-center"
        >
          <RiExchange2Line className="text-white text-3xl" />
        </button>
      </div>

      {/* Quit Button */}
      <div className="relative group">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          QUIT
        </div>
        <button
          onClick={onQuit}
          className="w-13 h-13 bg-[#FF0000]/80 hover:bg-gray-500/80 rounded-full flex items-center justify-center"
        >
          <IoMdExit className="text-white text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default BattleActionsPanel;
