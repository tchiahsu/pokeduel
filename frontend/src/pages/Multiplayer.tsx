import { Link } from 'react-router-dom';
import { useState } from 'react';
import homeBg from '../assets/bg-forrest.jpg';
import Button from '../components/Button';
import InputBox from '../components/InputBox';

export default function Multiplayer() {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [generatedRoomId, setGeneratedRoomId] = useState('');
    const [copyStatus, setCopyStatus] = useState<'generate' | 'copy'>('generate');
    
    // Dummy RoomID generated for now - to be changed and server should send a session ID
    const handleGenerateRoom = () => {
        const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedRoomId(newId);
        setRoomId(newId);
        setCopyStatus('copy');
    }

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(generatedRoomId);
        setCopyStatus('copy');
    };

    const handleButtonClick = () => {
        if (copyStatus === 'generate') {
            handleGenerateRoom();
        } else {
            handleCopyRoomId();
        }
    };
    
    return (
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
            
            <img
                src={homeBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="background"
            />

            {/* Multiplaye Title */}
            <div className="relative max-h-[15vh]">
                <h3 className="text-3xl pokemon-h3 m-10 text-left">
                    Multiplayer 
                </h3>
            </div>

            <div className="relative">
                <h1 className="text-8xl pb-12 tracking-[-8px] pokemon-h1 ">
                    PokeDuel
                </h1>
                <div className="flex flex-col gap-5 items-center justify-center">
                    {/* Input Box 1 to enter player name */}
                    <InputBox
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                    />
                    {/* Input Box 2 - roomID input box and generate butotn */}
                    {/* To be modified later to */}
                    <div className="flex gap-2 items-center w-full">
                        <InputBox
                            placeholder="Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button
                            onClick={handleButtonClick}
                            className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue"
                        >
                            {copyStatus === 'generate' ? 'Generate' : 'Copy'} 
                        </button>
                    </div>
                    {/* Input Box 3 to enter a Game-room */}
                    <InputBox
                        placeholder="Enter a Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                </div>
                <div>

                {/* Button to go back */}
                <Link to='/'>
                    <Button>Back to Home</Button>
                </Link>

                {/* Button to start the game, have to addd - grayed out until name and id entered */}
                <Link to='/team-selection'>
                    <Button>Start Game</Button>
                </Link>
                </div>
            </div>
        </div>
    );
}
