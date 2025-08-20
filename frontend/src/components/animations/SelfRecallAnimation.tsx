import { easeInOut, motion } from "motion/react";

export default function SelfRecallAnimation({ pokemon }: { pokemon: string }) {
  return (
    <>
      <div className="relative flex justify-start">
        <motion.img
          src={pokemon}
          alt="recall pokemon"
          initial={{ x: 0, y: 0, scale: 4 }}
          animate={{ x: -100, y: -100, filter: ["brightness(50)"], opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: easeInOut }}
        />
      </div>
    </>
  );
}
