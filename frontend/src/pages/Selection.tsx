import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import selectionBg from '../assets/bg-field.jpg';
import Pokedex from '../components/Pokedex';
import type { Pokemon } from '../services/DataSearch'
import clsx from 'clsx'

import pokeBall from '../assets/pokeball3.png';

type Props = {
list: Pokemon[];
};

const API_URL_BASE = 'http://localhost:8000';

// function to fetch a single pokemon name and sprite
const fetchPokemonData = async (name: string): Promise<Pokemon | null> => {
    try {
        const res = await fetch(`${API_URL_BASE}/pokemon/${name}/stats`);
        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return {name: data.name, sprite: data.frontSprite};
    } catch (error) {
        console.error(`Fetch error: `, error);
        return null;
    }
};

export default function Selection({ list }: Props) {
    const [showPokedex, setShowPokedex] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchedPokemon, setFetchedPokemon] = useState<Pokemon | null>(null);
    const [currPokemon, setCurrPokemon] = useState<Pokemon | null>(null);
    // const [currTeam, setCurrTeam] = useState<Pokemon[] | null>(null);
    const [error, setError] = useState<string | null>(null);

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
    }

    const handlePokedex = async (value: boolean) => {
        setShowPokedex(value);
        setCurrPokemon(null);
    }
    
    //set fetched pokemon to null and display default pokemon
    useEffect(() => {
        if (searchTerm === '') {
            setFetchedPokemon(null);
            setError(null);
        }
    }, [searchTerm]);

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
                    <Link to='/multiplayer'>
                        <Button>Back</Button>
                    </Link>
                    <Link to='/battle'>
                        <Button>Start Game</Button>
                    </Link>
                </div>
            </div>

            {/* Pokemon Selection Screen */}           
            <div className="flex max-h-[87vh]">
                {/* Left Panel */}
                <div className="flex-1 flex flex-col bg-gray-300 ml-6 mr-2 mb-6 rounded-lg opacity-80 gap-7 items-center pt-6">                                                          
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
                                             "item-start justify-items-center auto-rows-min",
                                             showPokedex? "grid-cols-4" : "grid-cols-6")}>
                            {error && (
                                <div className="text-red-600 col-span-6">
                                    <p>{error}</p>
                                </div>
                            )}
                            
                            {displayList.map((poke, index) => (
                                <div
                                    className={clsx("relative flex flex-col items-center rounded-lg hover:bg-gray-200 hover:scale-105 transition-all py-3 px-6 cursor-pointer",
                                                    currPokemon === poke ? "bg-gray-200 scale-105" : "")}
                                    key={index}
                                    onClick={() => {
                                        setShowPokedex(true);
                                        setCurrPokemon(poke);
                                }}>
                                    <img src={poke.sprite} alt={poke.name} className="w-36 h-36 pointer-events-none" />
                                    <span className="text-xs mt-1 capitalize">{poke.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pokemon Stats and Moves Sidebar Panel */}
                        <div className={clsx("flex overflow-x-hidden rounded-lg", showPokedex ? "px-4 pb-2 w-sm" : "p-0 w-0")}>
                            <Pokedex pokemon={currPokemon} close={handlePokedex}/>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
