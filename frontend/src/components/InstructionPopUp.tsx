import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import InfoButton from "./InfoButton";
import SelectionInstruction from "./Instructions/SelectionInstruction";
import BattleInstruction from "./Instructions/BattleInstruction";
import MainInstruction from "./Instructions/MainInstruction";

interface InstructionsPopupProps {
  onClose: () => void;
}

const InstructionsPopup: React.FC<InstructionsPopupProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"start" | "team" | "battle">("start");

  return (
    <div className="fixed inset-0 bg-black/50 z-200 flex items-center justify-center backdrop-blur-sm">
      {/* Instruction Page */}
      <div className="relative flex flex-col bg-gray-300/80 rounded-xl p-8 shadow-xl w-3/4 h-7/8 text-gray-700 justify-center items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl rounded-full text-grat-600 hover:scale-110 hover:bg-gray-300 active:scale-105"
        >
          <IoClose />
        </button>

        {/* Page Title */}
        <h2 className="text-2xl h-15 font-bold text-center text-[#2563eb]">How to Play PokeDuel</h2>
        <span className="text-gray-500 -mt-4 mb-8 italic text-xs">Quick guide to becoming a Champion</span>

        {/* Tab Buttons */}
        <div className="flex justify-center w-2/3 mb-6 bg-gray-300 rounded-lg">
          <InfoButton onClick={() => setActiveTab("start")} active={activeTab === "start"}>
            Create Game
          </InfoButton>
          <InfoButton onClick={() => setActiveTab("team")} active={activeTab === "team"}>
            Build Team
          </InfoButton>
          <InfoButton onClick={() => setActiveTab("battle")} active={activeTab === "battle"}>
            Battles
          </InfoButton>
        </div>

        {/* Tab Content */}
        <div className="flex flex-1 overflow-y-auto px-1 scroll-smooth space-y-4 text-[#2563eb] no-scrollbar">
          {activeTab === "start" && <MainInstruction />}
          {activeTab === "team" && <SelectionInstruction />}
          {activeTab === "battle" && <BattleInstruction />}
        </div>
      </div>
    </div>
  );
};

export default InstructionsPopup;
