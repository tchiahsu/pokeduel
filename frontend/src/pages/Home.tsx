import { useState} from 'react';
import { Link } from 'react-router-dom';
import homeBg from '../assets/bg-forrest.jpg';
import Button from '../components/Button';

import { IoInformation, IoVolumeMute, IoVolumeHigh } from "react-icons/io5";
import UtilityButton from '../components/UtilityButton';


// Home Screen
export default function Home() {
    const [muted, setMuted] = useState(false);

    const toggleMute = () => {
        setMuted(!muted);
    }

    return (
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
            
            {/* Background Image */}
            <img
                src={homeBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
            />

            {/* Utility Buttons */}
            <div className="hidden md:flex absolute top-0 right-0 m-15 gap-4">
                {/* Information Button */}
                <UtilityButton><IoInformation className="w-full h-auto p-1" /></UtilityButton>
                {/* Sound Button */}
                <UtilityButton onClick={toggleMute} hoverColor={muted ? "blue" : "red"}>
                    {muted ? <IoVolumeMute className="w-full h-auto p-2" /> : <IoVolumeHigh className="w-full h-auto p-2" />}
                </UtilityButton>
            </div>

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
        </div>
    );
}
