import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSocket } from "../contexts/SocketContext";

import battleBg from '../assets/bg-battle.jpg';
import StatsCard from '../components/BattlePage/StatsCard';
import BattleActionsPanel from '../components/BattlePage/BattleActionsPanel';
import BattleDisplayPanel from '../components/BattlePage/BattleDisplayPanel';
import ActivePokeCount from '../components/BattlePage/ActivePokeCount';
import QuitBattleBox from '../components/BattlePage/QuitBattleBox';

/**
 * Represents a move that a current pokemon can use.
 */
interface Move {
  name: string;
  type: string;
  pp: number;
  maxPp: number;
}

/**
 * Represents a pokemon in a Player's team.
 */
interface TeamMember {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
}

/**
 * Battle Screen for handling game play.
 */
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
        /**
         * Handles nextOptions event from server to update player and opponent data.
         * @param data containing team and move information
         */
        function onNextOptions(data: any) {
            console.log("nextOptions:", data);
            // parsing self data
            const parsedMoves: Move[] = data.moves.map((moveObj: any) => ({
                    name: moveObj.name,
                    type: moveObj.type,
                    pp: moveObj.pp,
                    maxPp: moveObj.maxPp
            }));
            const parsedTeam: TeamMember[] = data.pokemon.map((poke: any) => ({
                name: poke.name,
                hp: poke.hp,
                maxHp: poke.maxHp || 100,
                image: poke.sprite
            }));
            setSelfTeam(parsedTeam);
            setSelfMoves(parsedMoves);

            // parsing opponent's data
            if (data.opponent) {
                const parsedOpponentTeam: TeamMember[] = data.opponent.team.map((poke: any) => ({
                    name: poke.name || "???",
                    hp: poke.hp || 100,
                    maxHp: poke.maxHp || 100,
                    image: poke.sprite || undefined
                }));       
                setOpponentTeam(parsedOpponentTeam);
                setOpponentActiveIndex(data.opponent.activeIndex || 0);
            }
        }

        /**
         * Handles turnSummary event from server to display and update turn results.
         * @param summary array of turn event messages from the server
         */
        function onTurnSummary(summary: any[]) {
            console.log("turnSummary:", summary);
            const messages = summary.map((entry: any) => {
                // handle switching to a pokemon - self
                if (entry.user === 'self' && entry.animation === 'switch' && entry.name) {
                    const switchedIndex = selfTeam.findIndex(p => p.name.toLowerCase() === entry.name.toLowerCase());
                    if (switchedIndex !== -1) {
                        setSelfActiveIndex(switchedIndex);
                    }
                }
                // handle switching to a pokemon - self
                if (entry.user === 'opponent' && entry.animation === 'switch' && entry.name) {
                    const switchedIndex = opponentTeam.findIndex(p => p.name.toLowerCase() === entry.name.toLowerCase());
                    if (switchedIndex !== -1) {
                        setOpponentActiveIndex(switchedIndex);
                    }
                }
                return Array.isArray(entry.message) ? entry.message.join('\n') : entry.message;
            });
            setStatus(messages);
        }

        /**
         * Handles endGame event from the server.
         * @param data containing the game over message
         */
        function onEndGame(data: any) {
            alert(data.message);
            navigate('/') // to be changed to a pop-up that navigates to summary page
        }

        socket.on("turnSummary", onTurnSummary);
        socket.on("nextOptions", onNextOptions);
        socket.on("endGame", onEndGame);

        return () => {
            socket.off("nextOptions", onNextOptions);
            socket.off("turnSummary", onTurnSummary);
            socket.off("endGame", onEndGame);
        };
    }, [socket, navigate, selfTeam, opponentTeam]);

    //Functions to handle quitting the battle
    const handleQuit = () => setShowQuitConfirm(true);;
    const confirmQuit = () => navigate('/');
    const cancelQuit = () => setShowQuitConfirm(false);

    /**
     * Converts front sprite URL to a back sprite URL.
     * @param frontUrl the URL of the front sprite
     * @returns 
     */
    function getBackSpriteUrl(frontUrl: string): string | undefined {
        if (!frontUrl) return undefined;
        const match = frontUrl.match(/\/(\d+)\.png$/);
        const id = match ? match[1] : '0';
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`;
    }

    const selfActive = selfTeam[selfActiveIndex] || { name: '', image: null, hp: 0, maxHp: 100 };
    const opponentActive = opponentTeam[opponentActiveIndex] || { name: '', image: undefined, hp: 0, maxHp: 100 };

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
                {selfActive.image && (
                    <img
                        className="absolute w-200 h-150 select-none pointer-events-none"
                        src={getBackSpriteUrl(selfActive.image)}
                        alt={selfActive.name}
                    />)}
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
                            socket.emit("submitMove", {"action": "attack", "index": index});
                        }}
                        onSwitchSelect={(index) => {
                            console.log('Selected switch with index:', index);
                            setStatus(`You switched to ${selfTeam[index].name}\nWaiting for opponent...`);
                            setMode('none');
                            socket.emit("submitMove", {"action": "switch", "index": index});
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
    );
}