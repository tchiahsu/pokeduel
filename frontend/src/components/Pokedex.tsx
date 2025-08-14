import { useState, useEffect } from 'react';
import { searchPokeStats, searchPokeMoves } from '../services/pokemon';
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

    const LoadingAnimation = () => (
        <div className="max-w-2xl mx-auto overflow-hidden flex items-start">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-950"></div>
            <span className="ml-2 text-blue-950">Loading Pokemon Data...</span>
        </div>
    );

    const PokeStat = ({ category, value }) => (
        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-700">{category}:</span>
            <span className="text-blue-950 font-semibold">{value || "-"}</span>
        </div>
    );

    const PokeMove = ({ move }) => (
        <div 
            className="flex bg-blue-50 text-blue-800 px-3 py-1 rounder-full text-sm font-medium capitalize hover:bg-blue-100 w-full text-left"
        >
            <div className="flex-1">
                {move.name || move}
            </div>
            <div className="flex gap-2">
                <button>-</button>
                <button>+</button>
            </div>
        </div>
    );

    useEffect(() => {
        if (pokemon?.name) {
            fetchPokeData();
        }
    }, [pokemon?.name]);

    if (isLoading) {
        return <LoadingAnimation />
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Pokemon Name and Stats */}
            <div className="p-6 border-b border-gray-200">
                {pokeData ? (
                    <div className="space-y-4 relative">
                        <h2 className="text-2xl font-bold text-blue-950 text-center capitalize">{pokemon?.name}</h2>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <PokeStat category="Type" value={pokeData.type} />
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
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Moves</h3>
                
                {pokeMoves ? (
                    pokeMoves.length > 0 ? (
                        <div className="flex flex-wrap gap-2 cursor-pointer overflow-y-auto max-h-80">
                            {pokeMoves.map((move) => (
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
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => close(false)}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white font-medium rounded-lg cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer">
                        Add to Team
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Pokedex;