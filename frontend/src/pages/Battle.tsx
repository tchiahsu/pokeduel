import { Link } from 'react-router-dom';
import battleBg from '../assets/bg-battle.jpg';
import Button from '../components/Button';
import StatsCard from '../components/StatsCard';
import ControlPanel from '../components/ControlPanel';

interface Move {
  name: string;
  type: string;
  pp: number;
  maxPp: number;
}

export default function Battle() {
    return (
        <div className="relative flex w-screen h-screen overflow-hidden">
            {/* Background Image */}
            <img
                src={battleBg}
                className="absolute inset-0 opacity-50 w-full h-full object-cover pointer-events-none"
                alt="Battle Background"
            />

            <div className="absolute top-6 left-6 z-10">
                <StatsCard 
                    name="Gardevoir" 
                    image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png"
                    hp={100}
                    maxHp={140}
                />
            </div>

            <div className="absolute bottom-6 right-6 z-10">
                <StatsCard 
                    name="Sceptile" 
                    image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png"
                    hp={110}
                    maxHp={150}
                />
            </div>

            <ControlPanel
            team={[
                { name: 'Sceptile', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png', hp: 110, maxHp: 150 },
                { name: 'Flygon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/330.png', hp: 80, maxHp: 100 },
                { name: 'Torkoal', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/324.png', hp: 0, maxHp: 100 },
                { name: 'Jirachi', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png', hp: 0, maxHp: 150 },
                { name: '', image: '', hp: 0, maxHp: 0 },
                { name: '', image: '', hp: 0, maxHp: 0 },
            ]}
            moves={[
                { name: 'Leaf Blade', type: 'rock', pp:10, maxPp:10 },
                { name: 'Quick Attack', type: 'ghost', pp:10, maxPp:10 },
                { name: 'Energy Ball', type: 'grass', pp:15, maxPp:15 },
                { name: 'Detect', type: 'fighting', pp:25, maxPp:25 }
            ]}
            />

            {/* Left Panel */}
            <div className='basis-3/5 flex flex-row'>
                <div className='basis-1/5'></div>
                <div className='basis-4/5 flex flex-col'>
                    <div className='basis-2/5'></div>
                    <div className='relative basis-3/5 flex justify-baseline'>
                        <img 
                            className="absolute bottom-0 w-200 h-200 overflow-hidden"
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png" 
                            alt="Charmender" />
                    </div>
                </div>
            </div>
            {/* Right Panel */}
            <div className='basis-2/5 flex flex-col'>
                <div className='relative basis-5/9 flex justify-center-safe'>
                    <img 
                        className='absolute bottom-10 w-100 h-100'
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png" 
                        alt="Gardevoir" />
                </div>
            </div>
        </div>
    );
}
