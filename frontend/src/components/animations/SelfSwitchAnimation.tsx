import { useState } from "react";
import { easeInOut, motion } from "motion/react";
import pokeball from "../../assets/poke_pixel.png";

export default function SelfSwitchAnimation({
  prevPokemon,
  newPokemon,
  onComplete,
}: {
  prevPokemon: string;
  newPokemon: string;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"recall" | "throw" | "summon">(prevPokemon ? "recall" : "throw");

  return (
    <>
      {phase == "recall" && prevPokemon && (
        <motion.img
          src={prevPokemon}
          alt="recall pokemon"
          initial={{ x: 0, y: 0, filter: ["brightness(1)"], scale: 1 }}
          animate={{ x: -100, y: -100, filter: ["brightness(50)"], opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          onAnimationComplete={() => setPhase("throw")}
          className="w-3/4 h-auto select-none pointer-events-none"
        />
      )}

      {phase === "throw" && (
        <motion.img
          src={pokeball}
          alt="throw pokeball"
          initial={{ x: 0, y: 0, scale: 0.07, rotate: 0 }}
          animate={{
            x: [-300, -100, 0],
            y: [0, -185, -175, 0],
            scale: 0.07,
            rotate: -1500,
          }}
          transition={{ duration: 0.9, ease: easeInOut }}
          onAnimationComplete={() => setPhase("summon")}
          className="w-3/4 h-auto select-none pointer-events-none"
        />
      )}

      {phase === "summon" && (
        <motion.img
          src={newPokemon}
          alt="summon pokemon"
          initial={{ scale: 0, opacity: 0, filter: "brightness(10)" }}
          animate={{
            scale: [0, 1, 1],
            opacity: [0, 1, 1],
            filter: ["brightness(10)", "brightness(10)", "brightness(1)"],
            rotate: [0, 0, 0, 0, -7, 7, -7, 7, 0],
            y: [0, 0, 0, 0, 0, -20, 0, -20, 0],
          }}
          transition={{ duration: 0.5 }}
          className="w-3/4 h-auto select-none pointer-events-none"
          onAnimationComplete={onComplete}
        />
      )}
    </>
  );
}
