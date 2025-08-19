import { easeInOut, motion } from "motion/react";

export default function TestAnimation({ pokemon }: { pokemon: string }) {
  return (
    <>
      <div className="relative flex justify-start">
        <motion.img
          src={pokemon}
          alt="attack"
          initial={{ scale: 4, opacity: 1 }}
          animate={{ y: [0, 50], opacity: 0 }}
          transition={{ duration: 0.5, ease: easeInOut }}
        />
      </div>
    </>
  );
}
