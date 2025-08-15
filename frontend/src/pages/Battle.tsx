import { useState } from 'react';

import battleBg from '../assets/bg-battle.jpg';
import StatsCard from '../components/StatsCard';
import BattleActionsPanel from '../components/BattleActionsPanel';
import BattleDisplayPanel from '../components/BattleDisplayPanel';
import ActivePokeCount from '../components/ActivePokeCount';

interface Move {
  name: string;
  type: string;
  pp: number;
  maxPp: number;
}

export default function Battle() {
    const [mode, setMode] = useState<'none' | 'attack' | 'switch'>('none');

    //Created team and moves for testing
    const team = [
        { name: 'Sceptile', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png', hp: 110, maxHp: 150 },
        { name: 'Flygon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/330.png', hp: 80, maxHp: 100 },
        { name: 'Torkoal', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/324.png', hp: 0, maxHp: 100 },
        { name: 'Jirachi', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png', hp: 0, maxHp: 150 },
        { name: '', image: '', hp: 0, maxHp: 0 },
        { name: '', image: '', hp: 0, maxHp: 0 },
    ];
    const moves: Move[] = [
        { name: 'Leaf Blade', type: 'rock', pp: 10, maxPp: 10 },
        { name: 'Quick Attack', type: 'ghost', pp: 10, maxPp: 10 },
        { name: 'Energy Ball', type: 'grass', pp: 15, maxPp: 15 },
        { name: 'Detect', type: 'fighting', pp: 25, maxPp: 25 }
    ];
    return (
        <div className="relative flex w-screen h-screen overflow-hidden">
            {/* Background Image */}
            <img
                src={battleBg}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                alt="Battle Background"
            />

            {/* Opponent PokeBalls Bar */}
            <div className="absolute top-56 left-6 z-10">
                <ActivePokeCount team={team} />
            </div>
            {/* Oppenent stats card */}
            <div className="absolute top-6 left-6 z-10 select-none pointer-events-none">
                <StatsCard 
                    name="Gardevoir" 
                    image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png"
                    hp={28}
                    maxHp={140}
                />
            </div>

            {/* Player PokeBalls Bar */}
            <div className="absolute bottom-56 right-6 z-10">
                <ActivePokeCount team={team} />
            </div>
            {/* Player stats card */}
            <div className="absolute bottom-6 right-6 z-10 select-none pointer-events-none">
                <StatsCard 
                    name="Sceptile" 
                    image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png"
                    hp={75}
                    maxHp={150}
                />
            </div>

            {/* Control Panel */}
            <div className='flex absolute bottom-6 right-90 z-10 gap-4'>
                <BattleDisplayPanel mode={mode} moves={moves} team={team} />
                <BattleActionsPanel onSelect={setMode} />
            </div>
            
            {/* Left Panel */}
            <div className='basis-3/5 flex flex-row'>
                <div className='basis-1/5'></div>
                <div className='basis-4/5 flex flex-col border-2'>
                    <div className='basis-1/6 border-2'></div>
                    <div className='relative basis-2/6 flex justify-baseline'>
                    {/* Player Current Pokemon */}
                        <img 
                            className="absolute bottom--1 w-200 h-200 select-none pointer-events-none"
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png" 
                            alt="Charmender" />
                    </div>
                </div>
            </div>
            {/* Right Panel */}
            <div className='basis-2/5 flex flex-col'>
                <div className='relative basis-5/9 flex justify-center-safe'>
                {/* Opponent Current Pokemon */}
                    <img 
                        className='absolute bottom-10 w-80 h-80 select-none pointer-events-none'
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png" 
                        alt="Gardevoir" />
                </div>
            </div>
        </div>
    );
}
