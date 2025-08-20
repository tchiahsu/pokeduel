import { easeInOut, motion } from "motion/react";
import { useState } from "react";
import closed from "../../assets/closed_pokeball.png";
import opening from "../../assets/opening_pokeball.png";
import opened from "../../assets/opened_pokeball.png";

export default function OpponentSwitchAnimation({ pokemon, onComplete }: { pokemon: string; onComplete: () => void }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "opened" | "summon">("closed");
  return (
    <>
      <div className="relative flex justify-start">
        {phase === "closed" && (
          <motion.img
            src={closed}
            alt="closed pokeball"
            initial={{ opacity: 0.99, scale: 0.1 }}
            animate={{ opacity: 1, scale: 0.1 }}
            transition={{ duration: 0.5, ease: easeInOut }}
            onAnimationComplete={() => setPhase("opening")}
          />
        )}

        {phase === "opening" && (
          <motion.img
            src={opening}
            alt="opening pokeball"
            initial={{ y: -10, opacity: 0.99, scale: 0.1 }}
            animate={{ opacity: 1, scale: 0.1 }}
            transition={{ duration: 0.07, ease: easeInOut }}
            onAnimationComplete={() => setPhase("opened")}
          />
        )}

        {phase === "opened" && (
          <motion.img
            src={opened}
            alt="opened pokeball"
            initial={{ y: -110, opacity: 0.99, scale: 0.1 }}
            animate={{ opacity: 1, scale: 0.1 }}
            transition={{ duration: 0.05, ease: easeInOut }}
            onAnimationComplete={() => setPhase("summon")}
          />
        )}

        {phase === "summon" && (
          <motion.img
            src={pokemon}
            alt="summon pokemon"
            initial={{ scale: 0, filter: ["brightness(50)"] }}
            animate={{ scale: 4, filter: ["brightness(1)"] }}
            transition={{ duration: 0.5, ease: easeInOut }}
            onAnimationComplete={onComplete}
          />
        )}
      </div>
    </>
  );
}
