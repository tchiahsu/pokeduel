import { Link } from 'react-router-dom';
import { useState } from 'react';
import homeBg from '../assets/bg-forrest.jpg';
import Button from '../components/Button';
import InputBox from '../components/InputBox';

export default function Multiplayer() {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [mode, setMode] = useState<'create' | 'join' | null>(null);

    //handles creating a new roomID
    //to be modified later and connect to server
    const createRoomID = () => {
        const id = "tbh2025";
        setRoomId(id);
        setMode('create');
    }

    //handles when I user clicks join room
    const handleJoinRoom = () => {
        setMode('join');
    };

    //handles when a user clicks
    //to be modified later and connect to server
    const handleLeaveRoom = () => {
        setRoomId('');
        setMode(null);
    };

    //copy the text to system
    const copy = () => {
        navigator.clipboard.writeText(roomId);
        alert('RoomID copied!');
    }

    return (
        <div className="relative min-h-screen min-w-screen flex flex-col items-center justify-center">
            <img
                src={homeBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt="background"
            />

            <div className="absolute inset-x-0 top-0 pt-10 flex flex-col gap-7 items-center">
                <h3 className="text-3xl pokemon-h3 m-5 text-center">Multiplayer</h3>
                <h1 className="text-8xl pb-6 tracking-[-8px] pokemon-h1">PokeDuel</h1>
            </div>

            <div className="relative inset-x-0 inset-y-0">
                <div className="flex flex-col gap-6 items-center justify-center">
                    {mode === null && (
                        <InputBox
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        />
                    )}

                    {mode === null && (
                        <div className='flex gap-2'>
                            <Link to='/'>
                                <Button>Back to Home</Button>
                            </Link>
                            <Button onClick={createRoomID} disabled={!playerName}>Create Room</Button>
                            <Button onClick={handleJoinRoom} disabled={!playerName}>Join Room</Button>
                        </div>
                    )}

                    {mode === 'create' && (
                        <div className="flex flex-col items-center gap-1 pb-5">
                            <p className='text-gray-700 p-7'>Share the code to battle your friends!</p>
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-200 border-2 border-gray-400 rounded-lg py-2 px-20 text-gray-700">{roomId}</span>
                                <button onClick={copy} className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue">Copy</button>
                                <button onClick={handleLeaveRoom} className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue">Leave</button>
                            </div>
                        </div>
                    )}

                    {mode === 'join' && (
                        <div className='flex gap-2'> 
                            <InputBox
                                placeholder="Enter Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                            />
                            <button onClick={handleLeaveRoom} className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue">Leave</button>
                        </div>                        
                    )}

                </div>
                <div className='pt-6'>   
                {mode != null && (
                    <Link to='/team-selection'>
                        <Button disabled={!(roomId)}>Start Game</Button>
                    </Link>
                )}
                </div>
            </div>
        </div>
    );
}
