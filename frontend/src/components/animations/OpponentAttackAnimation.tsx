import { easeInOut, motion } from "motion/react";

export default function OpponentAttackAnimation({ pokemon, onComplete }: { pokemon: string; onComplete: () => void }) {
  return (
    <>
      <div className="relative flex justify-start">
        <motion.img
          src={pokemon}
          alt="attack"
          initial={{ x: 0, y: 0, scale: 4, rotate: 0 }}
          animate={{ x: [0, 120, -100, 0], y: [0, -50, 10, 0], rotate: [-20, -20, 0] }}
          transition={{ duration: 0.4, ease: easeInOut }}
          onAnimationComplete={onComplete}
        />
      </div>
    </>
  );
}
