import { Link } from 'react-router-dom';
import homeBg from '../assets/bg-forrest.jpg';
import GameModeButton from '../components/GameModeButton';

export default function Home() {
    return (
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
            
            <img
                src={homeBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            />

            <div className="relative">
                <h1 className="text-8xl pb-6 tracking-[-8px] pokemon-h1">
                    PokeDuel
                </h1>
                <p>Battle Friends, Become a Champion</p>
                <div>
                    <Link to='/multiplayer'>
                        <GameModeButton>Solo Battle</GameModeButton>
                    </Link>
                    <Link to='/multiplayer'>
                        <GameModeButton>Multiplayer</GameModeButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
