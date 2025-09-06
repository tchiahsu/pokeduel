import { Link } from 'react-router-dom';
import homeBg from '../assets/bg-forrest.jpg';
import Button from '../components/Button';

// Home Screen
export default function Home() {
    return (
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
            
            {/* Background Image */}
            <img
                src={homeBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
            />

            {/* Game Title */}
            <div className="text-8xl pb-6 tracking-[-8px] pokemon-h1 select-none z-10">
                <h1>PokeDuel</h1>
            </div>

            {/* Game Message */}
            <div className="select-none z-10 py-4 text-black">
                <p>Battle Friends, Become Champion</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row w-1/3 justify-center items-center gap-4 z-10">
                <Link to='/single-player'>
                    <Button>Solo Battle</Button>
                </Link>
                <Link to='/multiplayer'>
                    <Button>Multiplayer</Button>
                </Link>
            </div>

            {/* Credits */}
            <div className="absolute bottom-5 text-xs text-gray-600">
                Designed and Built by Harrison Pham, Bhoomika Gupta & Tony Hsu.
                <br /><br/>
                Powered by PokéAPI.
            </div>
        </div>
    );
}
