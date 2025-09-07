import { useState } from 'react';
import { Link } from 'react-router-dom';
import homeBg from '../assets/bg-forrest.jpg';
import Button from '../components/Button';
import { useServerWarmup } from '../utils/useServerWarmup';
import { IoWarningOutline } from "react-icons/io5";


// Home Screen
export default function Home() {
    const [active, setActive] = useState(false);
    const serverReady = useServerWarmup();

    return (
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
            
            {/* Background Image */}
            <img
                src={homeBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
            />

            {/* Server Warning */}
            {/* <div className="absolute top-10 left-10 text-red-700 flex flex-row items-center gap-3 z-10">
                <button onClick={() => setActive(!active)} className="animate-pulse cursor-pointer"><IoWarningOutline size={64} /></button>
                {active && 
                    (<div className="text-xs flex flex-col justify-start items-start duration-200 ease-in">
                        <p>The server may be asleep due to inactivity and</p>
                        <p> could take up to a minute to wake.</p>
                    </div>)
                }
            </div> */}

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
                    <Button disabled={!serverReady}>Solo Battle</Button>
                </Link>
                <Link to='/multiplayer'>
                    <Button disabled={!serverReady}>Multiplayer</Button>
                </Link>
            </div>

            {/* Warmup Message */}
            {!serverReady && (
                <div className="flex flex-col text-red-700 justify-center items-center mt-15 gap-2">
                    <button onClick={() => setActive(!active)} className="animate-pulse cursor-pointer"><IoWarningOutline size={48} /></button>
                    <div className="flex flex-col items-center gap-2 text-sm opacity-70">
                        <p>Warming up server...This may take up to 1 minute.</p>
                        <p>Read game instruction while you wait!</p>
                    </div>
                </div>
            )}

            {/* Credits */}
            <div className="absolute bottom-5 text-xs text-gray-600">
                Designed and Built by Tony Hsu Tai, Bhoomika Gupta, and Harrison Pham.
                <br /><br/>
                Powered by PokéAPI.
            </div>
        </div>
    );
}
