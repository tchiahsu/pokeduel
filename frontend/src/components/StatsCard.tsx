import React, { useState } from 'react';

interface StatsCardProps {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ name, image, hp, maxHp }) => {
  const [currentHp, setCurrentHp] = useState<number>(hp); // Added for future use
  const hpPercentage = (currentHp / maxHp) * 100;

  // Function to handle progress bar color
  const getHpColor = () => {
    if (hpPercentage <= 20) return 'bg-red-600';
    if (hpPercentage <= 50) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="bg-gray-300/80 rounded-lg p-4 w-80 h-50 shadow-lg select-none pointer-events-none">
      {/* For Name and Sprite of Current Pokemon */}
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">{name}</span>
        <img src={image} alt={name} className="w-12 h-auto" />
      </div>
      {/* For Hp of Current Pokemon*/}
      <div className="mt-14 text-lg text-left">
        <strong>HP:</strong> {currentHp}/{maxHp}
        {/* Progress bar as a nested div */}
        <div className="w-full h-4 bg-gray-400 rounded mt-1 overflow-hidden">
          <div
            className={`h-full ${getHpColor()}`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;