import React, { useState } from 'react';

interface StatsCardProps {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ name, image, hp, maxHp }) => {
  const [currentHp, setCurrentHp] = useState<number>(hp);

  return (
    <div className="bg-gray-300/90 border-2 border-gray-700 rounded-lg p-4 w-80 h-50 shadow-lg">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">{name}</span>
        <img src={image} alt={name} className="w-12 h-auto" />
      </div>
      <div className="mt-6 text-lg">
        <strong>HP:</strong> {currentHp}/{maxHp}
      </div>
    </div>
  );
};

export default StatsCard;