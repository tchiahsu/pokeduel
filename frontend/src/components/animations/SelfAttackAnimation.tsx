import { easeInOut, motion } from "motion/react";

export default function SelfAttackAnimation({ pokemon, onComplete }: { pokemon: string; onComplete: () => void }) {
  return (
    <>
      <motion.img
        src={pokemon}
        alt="attack"
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={{ x: [0, 0, -100, 120, 0], y: [0, 0, 10, -50, 0], rotate: [0, 12, 12, 0] }}
        transition={{ delay: 1.5, duration: 0.5, ease: easeInOut }}
        onAnimationComplete={onComplete}
        className="w-3/4 h-auto select-none pointer-events-none"
      />
    </>
  );
}
