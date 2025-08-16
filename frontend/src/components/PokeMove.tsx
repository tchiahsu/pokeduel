import { useState } from 'react';
import { searchMoveStats } from '../services/SearchAPI';

/**
 * Props for the PokeMove component:
 * - move: either a string or an object with a name property
 */
type PokeMoveProps = {
    move: string | { name: string };
};

/**
 * Represents a single Pokemon move in the Pokedex move list.
 */
const PokeMove = ({ move }: PokeMoveProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [moveData, setMoveData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Normalize move input into a consistent string form
    const moveName = typeof move === "string" ? move : move.name;
    // Remove dashes from move names made up of 2+ words
    const formattedName = moveName.replace(/-/g, " ");

    /**
     * Fetches detailed stats for the current move from the API
     */
    const fetchMoveStats = async () => {
        if (moveData || isLoading) return;
        
        setIsLoading(true);
        try {
            const res = await searchMoveStats(moveName);
            setMoveData(res);
        } catch (error) {
            console.error('Error fetching pokemon stats:', error);
            setMoveData(null);
        } finally {
            setIsLoading(false);
        }
    }   

    /**
     * Toggles the dropdown open/close
     * If opening it fetches move details from API
     */
    const toggleDropdown = () => {
        fetchMoveStats();
        setIsOpen(!isOpen);
    };
    
    return (
        <div className="flex flex-col bg-blue-50 text-blue-800 px-2 rounded-sm font-medium capitalize hover:bg-blue-100 w-full text-left">

            {/* Pokemon Move Button */}
            <div className="flex pt-2">
                <div className="flex-1 text-[10px]" onClick={toggleDropdown}>   
                    {formattedName}
                </div>
                <div className="flex gap-2">
                    <button>-</button>
                    <button>+</button>
                </div>
            </div>

            {/* Pokemon Move Stats Dropdown */}
            <div className="pb-2">
                {isOpen && (
                    <div className="space-y-1 pt-2">
                        {isLoading ? (
                            <>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Type: </div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Category: </div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Power: </div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Accuracy: </div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">PP: </div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Effect: </div>
                            </>
                        ) : moveData ? (
                            <>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Type: {moveData.type || 'Unknown'}</div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Category: {moveData.category || '-'}</div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Power: {moveData.power || '-'}</div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Accuracy: {moveData.accuracy || '-'}</div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">PP: {moveData.pp || '-'}</div>
                                <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">Effect: {moveData.effect || '-'}</div>
                            </>
                        ) : (
                            <div>Failed to load data</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
};

export default PokeMove;