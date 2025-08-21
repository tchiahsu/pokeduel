import { easeInOut, motion } from "motion/react";

export default function TakeDamageAnimation({ user, pokemon }: { user: string; pokemon: string }) {
  const positioning =
    user === "self" ? "w-3/4 h-auto select-none pointer-events-none" : "w-2/4 h-auto select-none pointer-events-none";

  return (
    <>
      <motion.img
        src={pokemon}
        alt="recall pokemon"
        initial={{ x: 0, y: 0 }}
        animate={{
          opacity: [1, 0, 1, 0, 1, 0, 1],
          filter: [
            "brightness(1.5)",
            "brightness(1)",
            "brightness(1.5)",
            "brightness(1)",
            "brightness(1.5)",
            "brightness(1)",
          ],
        }}
        transition={{ duration: 0.5, ease: easeInOut, delay: 0.2 }}
        className={positioning}
      />
    </>
  );
}
