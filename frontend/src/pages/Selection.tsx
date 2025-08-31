import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchPokemonData } from '../utils/SearchAPI';
import { useSocket } from "../contexts/SocketContext";
import { shake } from "../utils/effects";
import type { Pokemon } from '../types/pokemon'
import { toast } from 'sonner';
import { handleDeleteRoom } from "../utils/handleSocket";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from '../components/TeamSelection/SearchBar';
import Button from '../components/Button';
import selectionBg from '../assets/bg-field.jpg';
import Pokedex from '../components/TeamSelection/Pokedex';
import clsx from 'clsx'
import TeamButton from '../components/TeamSelection/TeamButton';
import IntermediatePopUp from '../components/TeamSelection/IntermediatePopUp';

// Base URL for the backend server
const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Props for the Selection page:
 * - list: initial list of Pokemon to render
 */
type SelectionProps = {
    list: Pokemon[];
    mode: "singleplayer" | "multiplayer";
};

// Team Selection Screen
export default function Selection({ list, mode: propMode }: SelectionProps) {
    const [showPokedex, setShowPokedex] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchedPokemon, setFetchedPokemon] = useState<Pokemon | null>(null);
    const [currPokemon, setCurrPokemon] = useState<Pokemon | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pokemonTeam, setPokemonTeam] = useState<Record<string, string[]>>({});
    const [teamSprites, setTeamSprites] = useState<Record<string, string>>({});
    const [leadPokemon, setLeadPokemon] = useState<string | null>(null);

    const socket = useSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const startRef = useRef<HTMLSpanElement>(null);
    const anchorRef = useRef<Record<string, HTMLDivElement | null>>({});
    const backRef = useRef<HTMLSpanElement>(null);

    const { playerName } = location.state || {}
    const { roomId } = useParams();
    const initialMovesForCurrent = currPokemon ? (pokemonTeam[currPokemon.name] ?? []) : [];

    const canStart = Object.keys(pokemonTeam).length > 0;

    const fetchRandomTeam = async () => {
        try {
            const res = await fetch(`${API_URL_BASE}/pokemon/random-team`);
            const team = await res.json();
            
            setPokemonTeam(team);

            const nextSprites: Record<string, string> = {};
            await Promise.all(
            Object.keys(team).map(async (name) => {
                const pokeData = await fetchPokemonData(name);
                if (pokeData) nextSprites[name] = pokeData.sprite;
            })
            );
            setTeamSprites(nextSprites);

            setLeadPokemon(Object.keys(team)[0] ?? null);      
        } catch (error) {
            console.error(`Error fetching random team: `, error);
            return null;
        }
    }

    /**
     * Searches the information for the given pokemon name
     */
    const handleSearch = async () => {
        const name = searchTerm.trim().toLowerCase();
        
        if (!name) {
            setFetchedPokemon(null);
            setError(null);
            return;
        }

        const pokemon = await fetchPokemonData(name);
        
        if (pokemon) {
            setFetchedPokemon(pokemon);
            setError(null);
        } else {
            setFetchedPokemon(null);
            setError('Pokemon not Found');
        }

        handlePokedex(false);
    }

    /**
     * Opens/closes the Pokedex panel on the right
     * Clears currently selected pokemon when the Pokedex closes
     */
    const handlePokedex = async (value: boolean) => {
        setShowPokedex(value);
        setCurrPokemon(null);
    }

    /**
     * Handler to accept one TeamEntry and add it to the team
     */
    const handleAddToTeam = (entry: { pokemon: string; moves: string[] }) => {
        setPokemonTeam( prev => {
            const size = Object.keys(prev).length;
            const alreadyInTeam = !prev[entry.pokemon];

            if (alreadyInTeam && size >= 6) return prev;
            if (!leadPokemon) setLeadPokemon(entry.pokemon);
        
            return { ...prev, [entry.pokemon]: entry.moves.slice(0,4) };
        });

        if (!teamSprites[entry.pokemon]) {
            const fromCurrent = currPokemon?.name === entry.pokemon ? currPokemon.sprite : undefined;
            if (fromCurrent) {
                setTeamSprites(prev => ({ ...prev, [entry.pokemon]: fromCurrent }));
            } else {
                void (async () => {
                    const poke = await fetchPokemonData(entry.pokemon);
                    if (poke?.sprite) {
                        setTeamSprites(prev => ({ ...prev, [entry.pokemon]: poke.sprite! }));
                    }
                })();
            }
        }
    };

    /**
     * Remove a pokemon from the team
     */
    const removeFromTeam = (name: string) => {
        setPokemonTeam(prev => {
            const { [name]: _, ...rest } = prev;
            if (leadPokemon === name) setLeadPokemon(Object.keys(rest)[0] ?? null);
            return rest;
        });

        setTeamSprites(prev => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
        if (leadPokemon === name) {
            const remaining = Object.keys(pokemonTeam).filter(poke => poke !== name);
            setLeadPokemon(remaining[0] ?? null);
        };
    }

    /**
     * Builds the ordered object (with lead at the start) before emitting
     * - team : the pokemon team with the name and the list of moves
     * - leadName : the pokemon that was selected as lead
     */
    const addLeadToStart = (team: Record<string, string[]>, leadName: string | null) => {
        const names = Object.keys(team);
        const orderedNames = leadName ? [leadName, ...names.filter(poke => poke !== leadName)] : names;

        // Reconstruct object in the new order
        return Object.fromEntries(orderedNames.map(poke => [poke, team[poke]]));
    }

    /**
     * Sends the team selection to the backend client
     * - team : the pokemon team selected by the player
     * - playerName : name of the player
     */
    const emitTeamSelection = async () => {
        if (!canStart) {
            shake(startRef.current);
            toast.error("Add at least 1 Pokemon to start game.")
            return;
        }

        const orderedTeam = addLeadToStart(pokemonTeam, leadPokemon);
        console.log("emit setPlayer", { name: playerName, teamSelection: orderedTeam })
        socket.emit("setPlayer", { name: playerName, teamSelection: orderedTeam });
        navigate(`/battle/${roomId}`);
    };

    // Copy the text to system
    const copy = () => {
        if (!roomId) return;
        navigator.clipboard.writeText(roomId);
        toast.info("Room ID Copied!")
    };

    /**
     * When the search box is cleared, reset fetches result.
     * This ensures the main list reappears as soon as the input is empty.
     */
    useEffect(() => {
        if (searchTerm === '') {
            setFetchedPokemon(null);
            setError(null);
        }
    }, [searchTerm]);

    // Display the single pokemon fetches the list of pokemon
    const displayList = fetchedPokemon ? [fetchedPokemon] : list

    return (
        <div className="relative min-h-screen min-w-screen flex flex-col">
            <img
                src={selectionBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
            />
            {/* Team Selection Title */}
            <div className="relative flex justify-between items-center max-h-[13vh] pr-2">

                <h3 className="text-4xl pokemon-h3 m-10 text-left select-none flex justify-center items-center">
                    Team Selection:
                </h3>
                <div className='flex justify-center items-center mr-4 gap-3'>
                    <span ref={backRef}>
                        <Button onClick={() => {handleDeleteRoom(roomId), navigate("/")}} size="xs">
                            Quit Game
                        </Button>
                    </span>

                    <Button onClick={copy} size="xs">
                        Copy RoomId
                    </Button>

                    <Button onClick={fetchRandomTeam} size="xs">
                        Randomize Team
                    </Button>

                    <span ref={startRef}>
                        <Button onClick={emitTeamSelection} variant="yellow" disabled={!canStart} size="xs">
                            Start Game
                        </Button>
                    </span>
                </div>
            </div>

            {/* Pokemon Selection Screen */}           
            <div className="flex max-h-[87vh]">

                {/* Left Panel */}
                <div className="relative w-36 flex flex-col bg-gray-300 ml-6 mr-2 mb-6 rounded-lg opacity-80 items-center">                                                     
                    <h3 className="sticky top-0 z-10 text-lg font-bold bg-gray-300 pt-3">TEAM</h3>
                    {Object.keys(teamSprites).length > 0 && (
                        <div className="grid grid-rows-auto p-3 cursor-pointer">
                            <AnimatePresence initial={false}>
                                {Object.entries(teamSprites).map(([poke, sprite]) => (
                                    <motion.div
                                        key={poke}
                                        layout
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                        transition={{ duration: 0.3, ease: "easeOut", layout: { type: "spring", stiffness: 500, damping: 35 }, }}
                                        className="relative rounded-lg p-2"
                                        ref={(element) => {anchorRef.current[poke] = element}}>
                                            <div className="flex-col relative group w-full flex items-center justify-center text-[10px]">
                                                <div className={clsx("flex flex-col justify-center items-center group-hover:opacity-50",
                                                                    leadPokemon === poke ? "text-amber-500" : ""
                                                )}>
                                                    <img
                                                        src={sprite}
                                                        alt={poke}
                                                        className="pointer-events-none select-none w-18 h-18"
                                                    />
                                                    {poke}
                                                </div>
                                                <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none gap-1 pt-3 cursor-pointer">
                                                    <TeamButton 
                                                        label="Starter"
                                                        color={leadPokemon === poke? "gray" : "yellow"}
                                                        onClick={() => setLeadPokemon(poke)}
                                                    />
                                                    <TeamButton 
                                                        label="Edit"
                                                        color="blue"
                                                        onClick={() => {
                                                            setShowPokedex(true);
                                                            setCurrPokemon({ name: poke, sprite: sprite });
                                                        }}                                                
                                                    />
                                                    <TeamButton 
                                                        label="Remove"
                                                        color="red"
                                                        onClick={() => removeFromTeam(poke)}                                                
                                                    />
                                                </div>
                                            </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>


                {/* Right Panel */}
                <div className="flex flex-col flex-12 relative bg-gray-300 mr-6 ml-2 mb-6 rounded-lg opacity-80 min-h-[80vh]">
                    {/* Search Pokemon Bar */}
                    <div className='flex sticky top-0 bg-gray-300 z-10 p-4 gap-2 rounded-lg'>
                        <SearchBar value = {searchTerm} onChange={setSearchTerm} onEnter={handleSearch}></SearchBar>
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                    
                    {/* Pokemon selection table */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Table of Pokemon */}
                        <div className={clsx("grid gap-2 p-2 relative flex-1 overflow-y-auto no-scrollbar",
                                             "items-start justify-items-center auto-rows-min",
                                             showPokedex? "grid-cols-4" : "grid-cols-6")}>
                            {error && (
                                <div className="text-red-600 col-span-6">
                                    <p>{error}</p>
                                </div>
                            )}
                            
                            {displayList.map((poke) => (
                                <div
                                    className={clsx("relative flex flex-col items-center rounded-lg hover:bg-gray-200 hover:scale-105 transition-all py-3 px-6 cursor-pointer",
                                                    currPokemon === poke ? "bg-gray-200 scale-105" : "")}
                                    key={poke.name}
                                    onClick={() => {
                                        if (showPokedex && currPokemon === poke) {
                                            setShowPokedex(false)
                                            setCurrPokemon(null)
                                        } else {
                                            setShowPokedex(true);
                                            setCurrPokemon(poke);
                                        }
                                }}>
                                    <img src={poke.sprite} alt={poke.name} className="w-36 h-36 pointer-events-none" />
                                    <span className="text-xs mt-1 capitalize">{poke.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pokemon Stats and Moves Sidebar Panel */}
                        <div className={clsx("flex overflow-x-hidden rounded-lg pb-2", showPokedex && "px-4 w-md ease-in-out duration-200", !showPokedex && "px-0 w-0 ease-in-out duration-200")}>
                            <Pokedex
                                pokemon={currPokemon}
                                close={handlePokedex}
                                initialMoves={initialMovesForCurrent}
                                onConfirm={handleAddToTeam}
                                team={pokemonTeam}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
