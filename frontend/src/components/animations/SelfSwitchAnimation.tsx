import { useState } from "react";
import { easeInOut, motion } from "motion/react";
import pokeball from "../../assets/poke_pixel.png";

export default function SelfSwitchAnimation({ pokemon }: { pokemon: string }) {
  const [phase, setPhase] = useState<"throw" | "summon">("throw");

  return (
    <>
      <div className="relative flex justify-start">
        {phase === "throw" && (
          <motion.img
            src={pokeball}
            alt="throw pokeball"
            initial={{ x: 0, y: 0, scale: 0.1, rotate: 0 }}
            animate={{ x: [100, 300, 400], y: [300, 115, 125, 300], scale: 0.1, rotate: -1500 }}
            transition={{ duration: 0.9, ease: easeInOut }}
            onAnimationComplete={() => setPhase("summon")}
          />
        )}

        {phase === "summon" && (
          <motion.img
            src={pokemon}
            alt="summon pokemon"
            initial={{ x: 400, y: 300, scale: 0, opacity: 0, filter: "brightness(10)" }}
            animate={{
              scale: [0, 4, 4],
              opacity: [0, 1, 1],
              filter: ["brightness(10)", "brightness(10)", "brightness(1)"],
              rotate: [0, 0, 0, 0, -7, 7, -7, 7, 0],
              y: [300, 300, 300, 300, 300, 280, 300, 280, 300],
            }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none"
            // onAnimationComplete={() => setPhase("dance")}
          />
        )}
        {/* 
        {phase === "dance" && (
          <motion.img
            src={pokemon}
            alt="pokeball"
            initial={{ x: 400, y: 300, scale: 4 }}
            transition={{ duration: 0.9, ease: easeInOut }}
          />
        )} */}
      </div>
    </>
  );
}
