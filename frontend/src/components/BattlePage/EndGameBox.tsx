import React from "react";
import Button from "../Button";

interface EndGameBoxProps {
  message: string;
  team: string[]; 
  onClose: () => void;
  playerName: string;
  background: string;
}

const EndGameBox: React.FC<EndGameBoxProps> = ({ message, team, onClose, background, playerName }) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* background image */}
      <img
        src={background}
        className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        alt="Battle Background"
      />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-gray-300/80 rounded-lg p-20 m-20 max-h-[80vh] shadow-lg text-center space-y-4 overflow-auto">
          <h1 className="text-8xl tracking-[-8px] pokemon-h1 z-10 select-none pointer-events-none">{message}</h1>
          <h2 className="text-xl text-gray-800 font-bold pt-6 select-none pointer-events-none">{playerName}'s Championship Team:</h2>
          <div className="flex justify-center gap-2  select-none pointer-events-none">
            {team.map((sprite, index) => (
              <img
                key={index}
                src={sprite}
                alt={`Pokemon ${index + 1}`}
                className="w-40 h-40 object-contain select-none"
              />
            ))}
          </div>
          <Button onClick={onClose}>Return to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default EndGameBox;