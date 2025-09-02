import { motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Prop that represents stats card of a Pokemon.
 */
interface StatsCardProps {
  name: string;
  image: string | undefined;
  HP: number;
  maxHP: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ name, image, HP, maxHP }) => {
  const [displayHP, setDisplayHP] = useState(HP);
  const HPPercentage = (displayHP / maxHP) * 100;

  useEffect(() => {
    if (HP < displayHP) {
      const interval = setInterval(() => {
        setDisplayHP((prevHP) => {
          if (prevHP > HP) return prevHP - 1;
          clearInterval(interval);
          return HP;
        });
      }, 75);

      return () => clearInterval(interval);
    } else {
      setDisplayHP(HP);
    }
  }, [HP]);

  // Gets the progress bar color based on HP
  const getHPColor = () => {
    if (HPPercentage <= 20) return "bg-red-600";
    if (HPPercentage <= 50) return "bg-yellow-500";
    return "bg-green-600";
  };

  return (
    <div className="bg-gray-300/80 rounded-lg p-4 flex-1 h-full shadow-lg select-none pointer-events-none">
      {/* For Name and Sprite of Current Pokemon */}
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">{name}</span>
        <img src={image} alt={name} className="w-12 h-auto" />
      </div>
      {/* For HP of Current Pokemon */}
      <div className="mt-14 text-lg text-left">
        <strong>HP:</strong> {displayHP}/{maxHP}
        {/* Progress bar as a nested div */}
        <div className="w-full h-4 bg-gray-400 rounded mt-1 overflow-hidden">
          <motion.div
            animate={{ width: `${HPPercentage}%` }}
            className={`h-full ${getHPColor()}`}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
