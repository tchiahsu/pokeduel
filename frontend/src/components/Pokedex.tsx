import { useState, useEffect } from 'react';
import { searchPokeStats, searchPokeMoves } from '../services/pokemon';
import PokeMove from '../components/PokeMove';
import PokeStat from '../components/PokeStat';
import type { Pokemon } from '../services/pokemon';

type PokedexProps = {
    pokemon: Pokemon | null;
    close: (value: boolean) => void;
}

const Pokedex = ({ pokemon, close }: PokedexProps) => {
    const [pokeData, setPokeData] = useState<any>(null);
    const [pokeMoves, setPokeMoves] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPokeData = async () => {
        if (!pokemon || isLoading) return;
        
        setIsLoading(true);

        setPokeData(null);
        setPokeMoves(null);

        try {
            const stats = await searchPokeStats(pokemon.name);
            setPokeData(stats)

            const moves = await searchPokeMoves(pokemon.name);
            setPokeMoves(moves)
        } catch (e) {
            console.error("Error fetching pokemon data: ", e);
            setPokeData(null);
            setPokeMoves(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (pokemon?.name) {
            fetchPokeData();
        }
    }, [pokemon?.name]);

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto overflow-hidden flex items-start">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-950"></div>
                <span className="ml-2 text-blue-950">Loading Pokemon Data...</span>
            </div>            
        )
    }

    return (
        <div className="relative w-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Pokemon Name and Stats */}
            <div className="p-4 border-b border-gray-200">
                {pokeData ? (
                    <div className="space-y-3 relative">
                        <h2 className="text-md font-bold text-blue-950 text-center capitalize">{pokemon?.name}</h2>
                        <div className="bg-gray-50 rounded-lg pl-4 pr-4 space-y-1 capitalize">
                            <PokeStat category="Type" value={Array.isArray(pokeData.types) ? pokeData.types.join(" & ") : pokeData.types} />
                            <PokeStat category="HP" value={pokeData.hp} />
                            <PokeStat category="Attack" value={pokeData.attack} />
                            <PokeStat category="Defense" value={pokeData.defense} />
                            <PokeStat category="Sp. Attack" value={pokeData["special-attack"]} />
                            <PokeStat category="Sp. Defense" value={pokeData["special-defense"]} />
                            <PokeStat category="Speed" value={pokeData.speed} />
                        </div>
                    </div>
                ) : (
                    <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
                        Failed to load Pokemon data
                    </div>
                )}
            </div>
            
            {/* Pokemon Moves Table */}
            <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Available Moves</h3>
                
                {pokeMoves ? (
                    pokeMoves.length > 0 ? (
                        <div className="flex flex-wrap gap-2 cursor-pointer overflow-y-auto max-h-[30vh] text-xs">
                            {pokeMoves.map((move: string | { name: string }) => (
                                <PokeMove move={move} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-4">
                            No moves available
                        </div>
                    )
                ) : (
                    <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
                        Failed to load Pokemon moves
                    </div>
                )}
            </div>

            {/* Stats Card Action Items */}
            <div className="absolute flex gap-2 w-full justify-center bottom-0 p-3">
                <button
                    onClick={() => close(false)}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white text-sm font-medium rounded-lg cursor-pointer"
                >
                    Close
                </button>
                <button
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer">
                    Add to Team
                </button>
            </div>

        </div>
    );
};

export default Pokedex;