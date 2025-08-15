import React from 'react';
import pokeBall from '../assets/poke_pixel.png';

interface Pokemon {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
}

interface ActivePokeProps {
  team: Pokemon[];
}

const ActivePokeCount: React.FC<ActivePokeProps> = ({ team }) => {
  return (
    <div className="flex gap-2 p-2 mt-1 mb-1">
      {team.map((poke, index) => {
        //Logic to be changed
        const isFainted = poke.hp <= 0 || poke.name === '';
        return (
          <img
            key={index}
            src={pokeBall}
            alt="PokéBall"
            className="w-10 h-10 select-none pointer-events-none"
            style={{ opacity: isFainted ? 0.3 : 1 }}
          />
        );
      })}
    </div>
  );
};

export default ActivePokeCount;
