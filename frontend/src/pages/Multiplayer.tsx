import { Link } from 'react-router-dom';
import { useState } from 'react';
import homeBg from '../assets/bg-forrest.jpg';
import Button from '../components/Button';
import InputBox from '../components/InputBox';
import { useNavigate } from 'react-router-dom';

export default function Multiplayer() {
    const API_URL_BASE = 'http://localhost:8000/room';
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [mode, setMode] = useState<'create' | 'join' | null>(null);
    const navigate = useNavigate();

    //handles creating a new roomID
    const createRoomID = async () => {
        try {
            const response = await fetch(API_URL_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isSinglePlayer: false }),
            });

            if (!response.ok) {
                throw new Error('Failed to create room');
            }

            const data = await response.json();
            setRoomId(data.id);
            setMode('create');
        } catch (error) {
            console.error("Error creating room: ", error)
            alert('Failed to create room. Please try again.');
        }
    }

    //handles when a user clicks "START GAME" after joining a room 
    const handleJoinRoom = async () => {
        try {
            const response = await fetch(`http://localhost:8000/room/${roomId}`);
            
            if (!response.ok) {
                const data = await response.json();
                alert(data.message || 'Room not found');
                return;
            }

            navigate('/team-selection');
        } catch (error) {
            console.error('Error joining room:', error);
            alert('Failed to join room');
        }
    };

    // handles deleting a room
    const handleDeleteRoom = async () => {
        try {
            const response = await fetch(`${API_URL_BASE}/${roomId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const data = await response.json();
                console.log('Server responded with error:', data.message);
            }
        } catch (error) {
            console.error("Error deleting room")
        } finally {
            setRoomId('');
            setMode(null);
        }
    }

    //handles when a user clicks Leave button in join mode
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
                className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                alt="background"
            />

            <div className="relative gap-5 flex flex-col gap-5 items-center select-none">
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
                            <Button onClick={() => setMode('join')} disabled={!playerName}>Join Room</Button>
                        </div>
                    )}

                    {mode === 'create' && (
                        <div className="flex flex-col items-center gap-1 pb-5">
                            <p className='text-gray-700 p-7 select-none'>Share the code to battle your friends!</p>
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-200 border-2 border-gray-400 rounded-lg py-2 px-20 text-gray-700">{roomId}</span>
                                <button onClick={copy} className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue">Copy</button>
                                <button onClick={handleDeleteRoom} className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue">Leave</button>
                            </div>
                        </div>
                    )}

                    {mode === 'join' && (
                        <div className='flex gap-2'> 
                            <InputBox
                                placeholder="Enter Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            />
                            <button onClick={handleLeaveRoom} className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:border-blue">Leave</button>
                        </div>                       
                    )}
                </div>
                <div className='pt-6'>   
                {mode != null && (
                    <Button onClick={mode === 'join' ? handleJoinRoom : () => navigate('/team-selection')} disabled={!(roomId)}>
                        Start Game
                    </Button>
                )}
                </div>
            </div>
        </div>
    );
}
