import React from 'react';
import pokeBall from '../../assets/poke_pixel.png';

// interface Pokemon {
//   name: string;
//   image: string;
//   hp: number;
//   maxHP: number;
// }

interface ActivePokeProps {
  teamCount: number;
  remainingPokemon: number;
}

const ActivePokeCount: React.FC<ActivePokeProps> = ({ teamCount, remainingPokemon  }) => {
  return (
    <div className="flex gap-2 p-2 mt-1 mb-1">
      {Array.from({ length: teamCount }).map((_, index) => {
        const isFainted = index >= remainingPokemon;
        // const isFainted = poke.hp <= 0 || poke.name === '';
        return (
          <img
            key={index}
            src={pokeBall}
            alt="PokeBall"
            className="w-10 h-10 select-none pointer-events-none"
            style={{ opacity: isFainted ? 0.3 : 1 }}
          />
        );
      })}
    </div>
  );
};

export default ActivePokeCount;
