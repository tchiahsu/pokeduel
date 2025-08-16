import { useState, useEffect } from 'react';
import { searchPokeStats, searchPokeMoves } from '../../services/SearchAPI';
import PokeMove from './PokeMove';
import PokeStat from './PokeStat';
import type { Pokemon } from '../../types/pokemon';

/**
 * Props for the Pokedex component:
 * - pokemon: the currently selected pokemon or null if none selected
 * - close: callback to hide the Pokedex and deselect pokemon
 */
type PokedexProps = {
    pokemon: Pokemon | null;
    close: (value: boolean) => void;
}

/**
 * Display detailed stats and available moves for a selected pokemon
 */
const Pokedex = ({ pokemon, close }: PokedexProps) => {
    const [pokeData, setPokeData] = useState<any>(null);
    const [pokeMoves, setPokeMoves] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Fetch Pokemon stats and moves from the API
     */
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

    /**
     * Refetch Pokemon data whenever the selected pokemon changes
     */
    useEffect(() => {
        if (pokemon?.name) {
            fetchPokeData();
        }
    }, [pokemon?.name]);

    // Loading animation while data is being fetched
    if (isLoading) {
        return (
            <div className="relative overflow-hidden flex items-start min-h-[87vh]">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-950"></div>
                <span className="ml-2 text-blue-950">Loading Data...</span>
            </div>            
        )
    }

    return (
        <div className="relative w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* Pokemon Name and Stats */}
            <div className="p-4 border-b border-gray-200">
                {pokeData ? (
                    <div className="space-y-3 relative">
                        {/* Pokemon Name */}
                        <h2 className="text-[13px] font-bold text-blue-950 capitalize">{pokemon?.name}</h2> 

                        {/* Pokemon Stats */}    
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
            <div className="relative px-4 pb-4 flex-1 flex flex-col overflow-y-auto text-xs no-scrollbar">
                <div className="sticky top-0 flex justify-between items-center bg-white py-3">
                    <h3 className="text-[13px] font-semibold text-gray-800 text-left indent-0.5">Select Moves</h3>
                    <span className="text-[10px]">0/4</span>
                </div>
                
                {pokeMoves ? (
                    pokeMoves.length > 0 ? (
                        <div className="flex flex-col gap-2 cursor-pointer">
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
            <div className="flex gap-2 w-full justify-center p-3 border-t border-gray-200">
                <button
                    onClick={() => close(false)}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white text-xs font-medium rounded-lg cursor-pointer"
                >
                    Close
                </button>
                <button
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg cursor-pointer">
                    Add to Team
                </button>
            </div>

        </div>
    );
};

export default Pokedex;