import { easeInOut, motion } from "motion/react";

export default function OpponentAttackAnimation({ pokemon, onComplete }: { pokemon: string; onComplete: () => void }) {
  return (
    <>
      <motion.img
        src={pokemon}
        alt="attack"
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={{ x: [0, 0, 120, -100, 0], y: [0, 0, -50, 10, 0], rotate: [0, -12, -12, 0] }}
        transition={{ delay: 1.5, duration: 0.5, ease: easeInOut }}
        onAnimationComplete={onComplete}
        className="w-2/4 h-auto select-none pointer-events-none"
      />
    </>
  );
}
