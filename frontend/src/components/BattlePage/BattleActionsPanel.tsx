import React from 'react';

import { GiMineExplosion } from "react-icons/gi";
import { RiExchange2Line } from "react-icons/ri";
import { IoMdExit } from "react-icons/io";

interface BattleActionsPanelProps {
  onSelect: (mode: 'none' | 'attack' | 'switch') => void;
}

const BattleActionsPanel: React.FC<BattleActionsPanelProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col w-20 h-50 rounded-lg bg-gray-300/80 p-1 justify-center items-center gap-2">
      <button
        onClick={() => onSelect('attack')}
        className="w-13 h-13 bg-[#FFA500]/80 hover:bg-gray-500/80 rounded-full flex items-center justify-center"
      >
        <GiMineExplosion className="text-white text-3xl" />
      </button>
      <button
        onClick={() => onSelect('switch')}
        className="w-13 h-13 bg-[#3B4CCA]/80 hover:bg-gray-500/80  rounded-full flex items-center justify-center"
      >
        <RiExchange2Line className="text-white text-3xl" />
      </button>
      <button
        onClick={() => onSelect('none')}
        className="w-13 h-13 bg-[#FF0000]/80 hover:bg-gray-500/80 rounded-full flex items-center justify-center"
      >
        <IoMdExit className="text-white text-3xl" />
      </button>
    </div>
  );
};

export default BattleActionsPanel;
