import { easeInOut, motion } from "motion/react";

export default function FaintAnimation({
  user,
  pokemon,
  onComplete,
}: {
  user: string;
  pokemon: string;
  onComplete: () => void;
}) {
  const positioning =
    user === "self" ? "w-3/4 h-auto select-none pointer-events-none" : "w-2/4 h-auto select-none pointer-events-none";

  return (
    <>
      <motion.img
        src={pokemon}
        alt={`${user}'s pokemon faints`}
        initial={{ opacity: 1 }}
        animate={{ y: [0, 50], opacity: 0 }}
        transition={{ duration: 0.5, ease: easeInOut }}
        onAnimationComplete={onComplete}
        className={positioning}
      />
    </>
  );
}
