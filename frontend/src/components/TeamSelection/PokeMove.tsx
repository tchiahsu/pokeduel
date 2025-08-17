import { useState } from 'react';
import MoveStat from './MoveStat'
import { searchMoveStats } from '../../services/SearchAPI';


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
        <div className="flex flex-col bg-blue-50 text-blue-800 px-2 rounded-sm font-medium capitalize hover:bg-blue-100 w-full text-left justify-center">

            {/* Pokemon Move Button */}
            <div className="flex py-1">
                <div className="flex flex-1 text-[10px] justify-left items-center" onClick={toggleDropdown}>   
                    {formattedName}
                </div>
                <div className="flex gap-2">
                    <button className="rounded-full px-0.5 text-[#2563eb] hover:scale-120 hover:text-red-500">-</button>
                    <button className="rounded-full px-0.5 text-[#2563eb] hover:scale-120 hover:text-green-600">+</button>
                </div>
            </div>

            {/* Pokemon Move Stats Dropdown */}
            <div>
                {isOpen && (
                    <div className="space-y-1 pb-2">
                        {isLoading ? (
                            <>
                                <MoveStat>Type: </MoveStat>
                                <MoveStat>Category: </MoveStat>
                                <MoveStat>Power: </MoveStat>
                                <MoveStat>Accuracy: </MoveStat>
                                <MoveStat>PP: </MoveStat>
                                <MoveStat>Effect: </MoveStat>
                            </>
                        ) : moveData ? (
                            <>
                                <MoveStat>Type: {moveData.type || 'Unknown'}</MoveStat>
                                <MoveStat>Category: {moveData.category || '-'}</MoveStat>
                                <MoveStat>Power: {moveData.power || '-'}</MoveStat>
                                <MoveStat>Accuracy: {moveData.accuracy || '-'}</MoveStat>
                                <MoveStat>PP: {moveData.pp || '-'}</MoveStat>
                                <MoveStat>Effect: {moveData.effect || '-'}</MoveStat>
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