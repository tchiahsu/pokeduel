import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Button from "../../components/Button";
import pokeball from "../../assets/poke_pixel.png";

type IntermediateProp = {
  isVisible: boolean;
  changePlayerStatus: (value: boolean) => void;
};

const IntermediatePopUp = ({ isVisible, changePlayerStatus }: IntermediateProp) => {
  // control sequential animations
  const animation = useAnimation();

  useEffect(() => {
    if (!isVisible) return;

    (async () => {
        // fall to ground
        await animation.start({
            opacity: 1,
            y: 30,
            scale: 0.5,
            rotate: 0,
            transition: { duration: 0.3, ease: "easeIn" },
        });

        // bounce
        await animation.start({
            opacity: 1,
            y: [30, 10, 30, 20, 30, 25, 30],
            scale: 0.5,
            transition: { duration: 0.5, ease: "easeOut" },
        });

        // wiggle
        animation.start({
            rotate: [0, -12, 9, -6, 3, 0],
            y: 30,
            transition: {
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            },
        });
    })();

    // optional: reset when hidden so it replays next time
    return () => {
      animation.stop();
    };
  }, [isVisible, animation]);


  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col gap-10 bg-gray-300/80 rounded-xl p-4 shadow-lg justify-center items-center text-center w-2/3 h-1/3 max-w-4xl ease-in-out duration-200">
        {/* Pokeball Wiggling Animation */}
        <div className="flex h-1/3 items-center justify-center">
          <motion.img
            src={pokeball}
            alt="pokeball"
            initial={{ opacity: 0, y: -30, scale: 0.5 }}
            animate={animation}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className="w-24 drop-shadow"
          />
        </div>

        {/* Waiting for Game Message */}
        <p className="text-lg font-semibold text-gray-700 pointer-events-none">
          Waiting for opponent to start...
        </p>

        {/* Exit Back to Team Selection */}
        <Button onClick={() => changePlayerStatus(false)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default IntermediatePopUp;