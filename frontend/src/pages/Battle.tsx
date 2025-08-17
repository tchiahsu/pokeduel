import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSocket } from "../contexts/SocketContext";

import battleBg from '../assets/bg-battle.jpg';
import StatsCard from '../components/BattlePage/StatsCard';
import BattleActionsPanel from '../components/BattlePage/BattleActionsPanel';
import BattleDisplayPanel from '../components/BattlePage/BattleDisplayPanel';
import ActivePokeCount from '../components/BattlePage/ActivePokeCount';
import QuitBattleBox from '../components/BattlePage/QuitBattleBox';

interface Move {
  name: string;
  type: string;
  pp: number;
  maxPp: number;
}

interface TeamMember {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
}

export default function Battle() {
    const [mode, setMode] = useState<'none' | 'attack' | 'switch'>('none');
    const [status, setStatus] = useState<string | any>('Select an action to begin...');
    const [showQuitConfirm, setShowQuitConfirm] = useState(false);

    const [selfTeam, setSelfTeam] = useState<TeamMember[]>([]);
    const [selfMoves, setSelfMoves] = useState<Move[]>([]);
    const [selfActiveIndex, setSelfActiveIndex] = useState(0);

    const [opponentTeam, setOpponentTeam] = useState<TeamMember[]>([]);
    const [opponentActiveIndex, setOpponentActiveIndex] = useState(0);

    const navigate = useNavigate();
    const socket = useSocket();

    useEffect(() => {
        function onNextOptions(data:any) {
            console.log("nextOptions:",data);

            const parsedMoves: Move[] = data.moves.map((moveObj: any) => {
                const name = Object.keys(moveObj)[0];
                return {
                    name,
                    pp: moveObj[name]
                };
            });
            setSelfMoves(parsedMoves);

            const parsedTeam: TeamMember[] = data.pokemon.map((poke: any) => ({
                name: poke.name,
                hp: poke.hp,
                maxHp: poke.maxHp || 100,
                image: poke.sprite
            }));

            setSelfTeam(parsedTeam);
            setSelfActiveIndex(0);
        }

        function onTurnSummary(summary: any[]) {
            console.log("turnSummary:", summary);

            const messages = summary.map((entry: any) => entry.message.join('\n'));
            setStatus(messages);
        }

        //later: to be changed to pop-up that navigates to summary page
        function onEndGame(data: any) {
            alert(data.message);
            navigate('/') // take to the summary page
        }

        socket.on("nextOptions", onNextOptions);
        socket.on("turnSummary", onTurnSummary);
        socket.on("endGame", onEndGame);

    }, [socket, navigate]);


    //handle quitting the game
    const handleQuit = () => setShowQuitConfirm(true);;
    const confirmQuit = () => navigate('/');
    const cancelQuit = () => setShowQuitConfirm(false);

    const selfActive = selfTeam[selfActiveIndex] || { name: '', image: '', hp: 0, maxHp: 100 };
    const opponentActive = opponentTeam[opponentActiveIndex] || { name: '???', image: '', hp: 100, maxHp: 100 };

    //Created team and moves for testing
    // const team1 = [
    //     { name: 'Sceptile', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png', hp: 110, maxHp: 150 },
    //     { name: 'Flygon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/330.png', hp: 80, maxHp: 100 },
    //     { name: 'Torkoal', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/324.png', hp: 0, maxHp: 100 },
    //     { name: 'Jirachi', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/385.png', hp: 0, maxHp: 150 },
    //     { name: '', image: '', hp: 0, maxHp: 0 },
    //     { name: '', image: '', hp: 0, maxHp: 0 },
    // ];
    // const moves1: Move[] = [
    //     { name: 'Leaf Blade', type: 'rock', pp: 10, maxPp: 10 },
    //     { name: 'Quick Attack', type: 'ghost', pp: 10, maxPp: 10 },
    //     { name: 'Energy Ball', type: 'grass', pp: 15, maxPp: 15 },
    //     { name: 'Detect', type: 'fighting', pp: 25, maxPp: 25 }
    // ];
    return (
        <div className="relative w-screen h-screen overflow-hidden grid grid-rows-3">
            {/* Background */}
            <img
                src={battleBg}
                className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
                alt="Battle Background"
            />
            {/* Top Section */}
            <div className="relative grid grid-cols-6">
                {/* Opponent Info */}
                <div className="flex flex-col ml-4 mt-4">
                <StatsCard
                    name={opponentActive.name}
                    image={opponentActive.image}
                    hp={opponentActive.hp}
                    maxHp={opponentActive.maxHp}
                />
                <ActivePokeCount team={opponentTeam} />
                </div>
                <div></div><div></div><div></div>
                {/* Opponent Pokémon */}
                <div className='relative'>
                <img
                    className="absolute w-80 h-auto select-none pointer-events-none"
                    src={opponentActive.image}
                    alt={opponentActive.name}
                />
                </div>
                <div></div>
            </div>

            {/* Middle Section Player Pokémon */}
            <div className="relative grid grid-cols-4">
                <div></div>
                {/* Player Pokémon */}
                <div className="relative flex justify-start">
                <img
                    className="absolute w-200 h-150 select-none pointer-events-none"
                    src={selfActive.image}
                    alt={selfActive.name}
                />
                </div>
                <div></div><div></div>
            </div>

            {/* Bottom Section (Controls + Player Stats) */} 
            <div className=" relative flex flex-row justify-between items-end gap-4 p-4 w-full">
                {/* Battle Display and Action Panel */}
                <div className="relative whitespace-pre-line flex-1 min-w-[250px] max-w-[500px]">
                    <BattleDisplayPanel 
                        mode={mode} 
                        moves={selfMoves} 
                        team={selfTeam} 
                        status={status} 
                        onMoveSelect={(index) => {
                            console.log('Selected move:', index);
                            setStatus(`You selected ${selfMoves[index].name}\nWaiting for opponent...`);
                            setMode('none');
                            socket.emit("submitMove", {"action": "attack", "index": index})
                        }}
                        onSwitchSelect={(index) => {
                            console.log('Selected switch with index:', index);
                            setStatus(`You switched to ${selfTeam[index].name}\nWaiting for opponent...`);
                            setMode('none');
                            socket.emit("submitMove", {"action": "switch", "index": index})
                        }}
                    />
                </div>
                {/* Player Stats and Action panel */}
                <div className="relative flex flex-row gap-3">
                    <div className="relative flex flex-col justify-end items-center min-w-[100px] max-w-[200px]">
                        <BattleActionsPanel onSelect={setMode} onQuit={handleQuit} />
                    </div>
                    <div className="relative flex flex-col items-end min-w-[200px]">
                        <ActivePokeCount team={selfTeam} />
                        <StatsCard
                        name={selfActive.name}
                        image={selfActive.image}
                        hp={selfActive.hp}
                        maxHp={selfActive.maxHp}
                        />
                    </div>
                </div>
            </div>
            {showQuitConfirm && (
                <QuitBattleBox onConfirm={confirmQuit} onCancel={cancelQuit} />
            )}
        </div>

//old code with absolute placing
        // <div className="relative flex w-screen h-screen overflow-hidden">
        //     {/* Background Image */}
        //     <img
        //         src={battleBg}
        //         className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        //         alt="Battle Background"
        //     />

        //     {/* Opponent PokeBalls Bar */}
        //     <div className="absolute top-56 left-6 z-10">
        //         <ActivePokeCount team={team} />
        //     </div>
        //     {/* Oppenent stats card */}
        //     <div className="absolute top-6 left-6 z-10 select-none pointer-events-none">
        //         <StatsCard 
        //             name="Gardevoir" 
        //             image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png"
        //             hp={28}
        //             maxHp={140}
        //         />
        //     </div>

        //     {/* Player PokeBalls Bar */}
        //     <div className="absolute bottom-56 right-6 z-10">
        //         <ActivePokeCount team={team} />
        //     </div>
        //     {/* Player stats card */}
        //     <div className="absolute bottom-6 right-6 z-10 select-none pointer-events-none">
        //         <StatsCard 
        //             name="Sceptile" 
        //             image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png"
        //             hp={75}
        //             maxHp={150}
        //         />
        //     </div>

        //     {/* Control Panel */}
        //     <div className='flex absolute bottom-6 right-90 z-10 gap-4'>
        //         <BattleDisplayPanel mode={mode} moves={moves} team={team} />
        //         <BattleActionsPanel onSelect={setMode} />
        //     </div>
            
        //     {/* Left Panel */}
        //     <div className='basis-3/5 flex flex-row'>
        //         <div className='basis-1/5'></div>
        //         <div className='basis-4/5 flex flex-col border-2'>
        //             <div className='basis-1/6 border-2'></div>
        //             <div className='relative basis-2/6 flex justify-baseline'>
        //             {/* Player Current Pokemon */}
        //                 <img 
        //                     className="absolute bottom--1 w-200 h-200 select-none pointer-events-none"
        //                     src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png" 
        //                     alt="Charmender" />
        //             </div>
        //         </div>
        //     </div>
        //     {/* Right Panel */}
        //     <div className='basis-2/5 flex flex-col'>
        //         <div className='relative basis-5/9 flex justify-center-safe'>
        //         {/* Opponent Current Pokemon */}
        //             <img 
        //                 className='absolute bottom-10 w-80 h-80 select-none pointer-events-none'
        //                 src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png" 
        //                 alt="Gardevoir" />
        //         </div>
        //     </div>
        // </div>
    );
}
