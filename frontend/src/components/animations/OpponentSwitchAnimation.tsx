import { easeInOut, motion } from "motion/react";
import { useState } from "react";
import closed from "../../assets/closed_pokeball.png";
import opening from "../../assets/opening_pokeball.png";
import opened from "../../assets/opened_pokeball.png";

export default function OpponentSwitchAnimation({ pokemon, onComplete }: { pokemon: string; onComplete: () => void }) {
  const [phase, setPhase] = useState<"closedBall" | "openingBall" | "openedBall" | "summon">("closedBall");
  return (
    <>
      {phase === "closedBall" && (
        <motion.img
          src={closed}
          alt="closed pokeball"
          initial={{ opacity: 0.99, scale: 0.1 }}
          animate={{ opacity: 1, scale: 0.1 }}
          transition={{ duration: 1, ease: easeInOut }}
          onAnimationComplete={() => setPhase("openingBall")}
          className="w-2/4 h-auto select-none pointer-events-none"
        />
      )}

      {phase === "openingBall" && (
        <motion.img
          src={opening}
          alt="opening pokeball"
          initial={{ y: -5, opacity: 0.99, scale: 0.1 }}
          animate={{ opacity: 1, scale: 0.1 }}
          transition={{ duration: 0.09, ease: easeInOut }}
          onAnimationComplete={() => setPhase("openedBall")}
          className="w-2/4 h-auto select-none pointer-events-none"
        />
      )}

      {phase === "openedBall" && (
        <motion.img
          src={opened}
          alt="opened pokeball"
          initial={{ y: -50, opacity: 0.99, scale: 0.1 }}
          animate={{ opacity: 1, scale: 0.1 }}
          transition={{ duration: 0.06, ease: easeInOut }}
          onAnimationComplete={() => setPhase("summon")}
          className="w-2/4 h-auto select-none pointer-events-none"
        />
      )}

      {phase === "summon" && (
        <motion.img
          src={pokemon}
          alt="summon pokemon"
          initial={{ scale: 0, filter: ["brightness(50)"] }}
          animate={{
            y: [0, 10, 0, 10, 0, 0],
            scale: [0, 1, 1],
            opacity: [0, 1, 1],
            rotate: [0, 0, 0, 0, -7, -7, 0, 7, 7, 0],
            filter: ["brightness(1)"],
          }}
          transition={{ duration: 0.5, ease: easeInOut }}
          onAnimationComplete={onComplete}
          className="w-2/4 h-auto select-none pointer-events-none"
        />
      )}
    </>
  );
}
