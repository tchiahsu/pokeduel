import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toTitleCase } from "../../utils/helpers";

/**
 * Prop that represents stats card of a Pokemon.
 */
interface StatsCardProps {
  name: string | undefined;
  image: string | undefined;
  hp: number;
  maxHP: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ name, image, hp, maxHP }) => {
  const [displayHP, setDisplayHP] = useState(hp);
  const HPPercentage = (displayHP / maxHP) * 100;
  const isLoading = name === "Loading...";

  useEffect(() => {
    if (hp < displayHP) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayHP((prevHP) => {
            if (prevHP > hp) return prevHP - 1;
            clearInterval(interval);
            return hp;
          });
        }, 75);

        return () => clearInterval(interval);
      }, 1500);

      return () => clearTimeout(timeout);
    } else {
      setDisplayHP(hp);
    }
  }, [hp]);

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
        <span className="text-xl font-bold">{toTitleCase(name)}</span>
        {isLoading && (
          <div className="animate-spin rounded-full h-10 w-10 my-9 border-b-5 border-l-5 border-blue-500"></div>
        )}
        {!isLoading && <img src={image} alt={name} className="w-12 h-auto" />}
      </div>
      {/* For HP of Current Pokemon */}
      <div className="mt-14 text-lg text-left">
        <strong>HP:</strong> {displayHP}/{maxHP}
        {/* Progress bar as a nested div */}
        <div className="w-full h-4 bg-gray-400 rounded mt-1 overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${HPPercentage}%` }}
            style={displayHP === 0 ? { width: "0%" } : {}}
            className={`h-full ${getHPColor()}`}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
