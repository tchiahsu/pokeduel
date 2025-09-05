import { easeInOut, motion } from "motion/react";
import { useState } from "react";
import closed from "../../assets/closed_pokeball.png";
import opening from "../../assets/opening_pokeball.png";
import opened from "../../assets/opened_pokeball.png";

export default function OpponentSwitchAnimation({
  prevPokemon,
  newPokemon,
  onComplete,
}: {
  prevPokemon: string;
  newPokemon: string;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"recall" | "placeBall" | "closedBall" | "openingBall" | "openedBall" | "summon">(
    prevPokemon ? "recall" : "placeBall"
  );
  return (
    <>
      {phase === "recall" && (
        <motion.img
          src={prevPokemon}
          alt="recall pokemon"
          initial={{ x: 0, y: 0, filter: ["brightness(1)"], scale: 1 }}
          animate={{ x: 100, y: -100, filter: ["brightness(50)"], opacity: 0, scale: 0 }}
          transition={{ delay: 1.5, duration: 0.4, ease: easeInOut }}
          onAnimationComplete={() => setPhase("placeBall")}
          className="w-2/4 h-auto select-none pointer-events-none"
        />
      )}

      {phase === "placeBall" && (
        <motion.img
          src={closed}
          alt="closed pokeball"
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 0.1 }}
          transition={{ delay: prevPokemon ? 0 : 1.5, ease: easeInOut }}
          onAnimationComplete={() => setPhase("closedBall")}
          className="w-2/4 h-auto select-none pointer-events-none"
        />
      )}

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
          transition={{ duration: 0.07, ease: easeInOut }}
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
          transition={{ duration: 0.05, ease: easeInOut }}
          onAnimationComplete={() => setPhase("summon")}
          className="w-2/4 h-auto select-none pointer-events-none"
        />
      )}

      {phase === "summon" && (
        <motion.img
          src={newPokemon}
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
