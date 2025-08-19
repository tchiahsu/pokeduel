import { easeInOut, motion } from "motion/react";

export default function TakeDamageAnimation({ pokemon }: { pokemon: string }) {
  return (
    <>
      <div className="relative flex justify-start">
        <motion.img
          src={pokemon}
          alt="recall pokemon"
          initial={{ x: 0, y: 0, scale: 4 }}
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
          transition={{ duration: 0.5, ease: easeInOut }}
        />
      </div>
    </>
  );
}
