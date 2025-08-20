import { useRef, useState, useEffect, useMemo } from 'react';
import { searchPokeStats, searchPokeMoves } from '../../utils/SearchAPI';
import type { Pokemon } from '../../types/pokemon';
import { shake } from '../../utils/shake';
import { toast } from 'sonner';

import PokeMove from './PokeMove';
import PokeStat from './PokeStat';
import PokedexButton from './PokedexButton';

/**
 * Props for the Pokedex component:
 * - pokemon: the currently selected pokemon or null if none selected
 * - close: callback to hide the Pokedex and deselect pokemon
 */
type PokedexProps = {
    pokemon: Pokemon | null;
    close: (value: boolean) => void;
    initialMoves: string[];
    onConfirm: (entry: { pokemon: string; moves: string[] }) => void;
    team: Record<string, string[]>;
}

/**
 * Display detailed stats and available moves for a selected pokemon
 */
const Pokedex = ({ pokemon, close, initialMoves, onConfirm, team }: PokedexProps) => {
    const [pokeData, setPokeData] = useState<any>(null);
    const [pokeMoves, setPokeMoves] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [moves, setMoves] = useState<string[]>(initialMoves)
    const addButtonRef = useRef<HTMLButtonElement>(null);

    const getMoveName = (move: any) => (typeof move === "string" ? move : move.name);

    /**
     * Fetch Pokemon stats and moves from the API
     */
    const fetchPokeData = async () => {
        if (!pokemon || isLoading) return;
        
        setIsLoading(true);

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

    const isSelected = pokemon != null && Object.keys(team).includes(pokemon.name);

    const addPokemonToTeam = () => {
        if (!pokemon) return;
        if (Object.keys(team).length === 6) {
            shake(addButtonRef.current);
            toast.error("You've reached the maximum of 6 Pokemon per team");
            return;
        }
        if (moves.length < 1) {
            shake(addButtonRef.current);
            toast.error("Select at least 1 move before adding this Pokemon.");
            return;
        }
        onConfirm({ pokemon: pokemon.name, moves: [...moves] })
        close(false);
    }

    const handleRandomMoves = () => {
    if (!pokeMoves || pokeMoves.length === 0) {
        toast.error("No moves available to randomize");
        return;
    }

    const allMoves = pokeMoves.map((move: string | { name: string}) => getMoveName(move));
    
    const random = [...allMoves].sort(() => Math.random() - 0.5);
    setMoves(random.slice(0, 4));
    }

    /**
     * Refetch Pokemon data whenever the selected pokemon changes
     */
    useEffect(() => {
        if (pokemon?.name) {
            fetchPokeData();
        }
    }, [pokemon?.name]);

    /**
     * Reset local draft of the pokemon when we switch pokemons
     */
    useEffect(() => {
        setMoves(initialMoves);
    }, [pokemon?.name, initialMoves]);

    const { selected, remaining} = useMemo(() => {
        if (!pokeMoves) return { selected: [], remaining: [] };
        const set = new Set(moves);
        const sel: any[] = [];
        const rem: any[] = [];
        for (const move of pokeMoves) {
            const name = getMoveName(move);
            (set.has(name) ? sel : rem).push(move);
        }
        return { selected: sel, remaining: rem };
    }, [pokeMoves, moves]);

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
                    <span className="text-[10px]">{moves.length}/4</span>
                </div>
                
                {pokeMoves ? (
                    pokeMoves.length > 0 ? (
                        <div className="flex flex-col gap-3">
                        {/* Selected moves */}
                        {selected.length > 0 && (
                            <div>
                            <h4 className="text-[11px] font-bold text-green-700 mb-1">Selected</h4>
                            <div className="flex flex-col gap-2">
                                {selected.map((move: any) => (
                                <PokeMove
                                    key={typeof move === "string" ? move : move.name}
                                    move={move}
                                    moves={moves}
                                    setMoves={setMoves}
                                />
                                ))}
                            </div>
                            </div>
                        )}

                        {/* Remaining moves */}
                        {remaining.length > 0 && (
                            <div>
                            <h4 className="text-[11px] font-bold text-gray-600 mb-1">Available</h4>
                            <div className="flex flex-col gap-2">
                                {remaining.map((move: any) => (
                                <PokeMove
                                    key={typeof move === "string" ? move : move.name}
                                    move={move}
                                    moves={moves}
                                    setMoves={setMoves}
                                />
                                ))}
                            </div>
                            </div>
                        )}
                        </div>
                    ) : (
                    <div className="text-gray-500 text-center py-4">No moves available</div>
                    )
                ) : (
                    <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
                    Failed to load Pokemon moves
                    </div>
                )}

            </div>

            {/* Stats Card Action Items */}
            <div className="flex gap-2 w-full justify-center p-3 border-t border-gray-200">
                <PokedexButton
                    label="Close"
                    onClick={() => close(false)}
                    color="red"
                />
                <PokedexButton
                    label="Clear"
                    onClick={() => setMoves([])}
                    color="gray"
                />
                <PokedexButton
                    label="Random"
                    onClick={handleRandomMoves}
                    color="gray"
                />
                <PokedexButton
                    label={isSelected ? "Update" : "Add"}
                    onClick={addPokemonToTeam}
                    color="blue"
                />
            </div>

        </div>
    );
};

export default Pokedex;