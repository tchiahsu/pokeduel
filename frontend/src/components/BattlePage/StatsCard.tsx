/**
 * Prop that represents stats card of a Pokemon.
 */
interface StatsCardProps {
  name: string;
  image: string | undefined;
  hp: number;
  maxHP: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ name, image, hp, maxHP }) => {
  // const [currentHp, setCurrentHp] = useState<number>(hp);

  // useEffect(() => {
  //   setCurrentHp(hp);
  // }, [hp]);

  const hpPercentage = (hp / maxHP) * 100;

  // Gets the progress bar color based on hp
  const getHpColor = () => {
    if (hpPercentage <= 20) return 'bg-red-600';
    if (hpPercentage <= 50) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="bg-gray-300/80 rounded-lg p-4 flex-1 h-full shadow-lg select-none pointer-events-none">
      {/* For Name and Sprite of Current Pokemon */}
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">{name}</span>
        <img src={image} alt={name} className="w-12 h-auto" /> 
      </div>
      {/* For Hp of Current Pokemon */}
      <div className="mt-14 text-lg text-left">
        <strong>HP:</strong> {hp}/{maxHP}
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