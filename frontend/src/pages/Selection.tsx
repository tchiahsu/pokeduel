import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import selectionBg from '../assets/bg-field.jpg';

type Pokemon = {
        name: string;
        sprite: string;
};

type Props = {
list: Pokemon[];
};

const API_URL_BASE = 'http://localhost:8000';

// function to fetch a single pokemon name and sprite
const fetchPokemonData = async (name: string): Promise<Pokemon | null> => {
    try {
        const res = await fetch(`${API_URL_BASE}/get-pokemon-data/${name}`);
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
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchedPokemon, setFetchedPokemon] = useState<Pokemon | null>(null);
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
            <div className="relative flex justify-between items-start max-h-[15vh] pr-2">
                <h3 className="text-3xl pokemon-h3 m-10 text-left">
                    Team Selection:
                </h3>
                <Link to='/multiplayer' className='m-8'>
                    <Button>Back</Button>
                </Link>
            </div>

            {/* Pokemon Selection Screen */}           
            <div className="flex max-h-[85vh]">
                {/* Left Panel */}
                <div className="flex-1 bg-gray-300 ml-6 mr-2 mb-6 rounded-lg opacity-80">
                    pokemon team go here
                </div>

                {/* Right Panel */}
                <div className="flex-12 relative bg-gray-300 mr-6 ml-2 mb-6 rounded-lg opacity-80 overflow-y-auto min-h-[80vh]">
                    {/* Search Pokemon Bar */}
                    <div className='flex sticky top-0 bg-gray-300 z-10 pt-4 pl-4 pr-4 gap-2'>
                        <SearchBar value = {searchTerm} onChange={setSearchTerm}></SearchBar>
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-6 p-4">
                        {error && (
                            <div className="text-red-600 col-span-6">
                                <p>{error}</p>
                            </div>
                        )}

                        {displayList.map((poke, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center hover:bg-white hover:scale-105 transition-all rounded-md p-2 cursor-pointer"
                            >
                            <img src={poke.sprite} alt={poke.name} className="w-36 h-36" />
                            <span className="text-xs mt-1 capitalize">{poke.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
