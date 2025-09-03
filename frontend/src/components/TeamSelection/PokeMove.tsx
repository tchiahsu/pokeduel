import { useRef, useState } from 'react';
import { searchMoveStats } from '../../utils/searchAPI';
import { shake } from '../../utils/helpers';
import { toast } from 'sonner';

import MoveStat from './MoveStat'
import clsx from 'clsx';

/**
 * Props for the PokeMove component:
 * - move: either a string or an object with a name property
 */
type PokeMoveProps = {
    move: string | { name: string };
    moves: string[];
    setMoves: (moves: string[]) => void;
};

/**
 * Represents a single Pokemon move in the Pokedex move list.
 */
const PokeMove = ({ move, moves, setMoves }: PokeMoveProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [moveData, setMoveData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Normalize move input into a consistent string form
    const moveName = typeof move === "string" ? move : move.name;
    // Remove dashes from move names made up of 2+ words
    const formattedName = moveName.replace(/-/g, " ");
    // Check if move has been selected
    const isSelected = moves.includes(moveName);

    const addRef = useRef<HTMLButtonElement>(null);
    const removeRef = useRef<HTMLButtonElement>(null);

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

    /**
     * Handles the logic for adding a move to Pokemon
     * Prevents the same move from getting added twice
     * Prevents from exceeding the maximum of 4 moves
     */
    const handleAdd = () => {
        if (isSelected) {
            shake(addRef.current);
            toast.error("That move is already on your list.");
            return;
        }
        if (moves.length >= 4) {
            shake(addRef.current);
            toast.error("You can pick up to 4 moves.");
            return;
        }
        setMoves([...moves, moveName]);
    };

    /**
     * Handles the logic for removing a move from a Pokemon
     * Prevents user from removing a mode that was never added
     */
    const handleRemove = () => {
        if (!isSelected) {
            shake(removeRef.current);
            toast.error("That move isn't on your list.");
            return;
        }
        setMoves(moves.filter(move => move !== moveName));
    };
    
    return (
        <div className={clsx("flex flex-col pl-2 rounded-sm font-medium capitalize w-full text-left justify-center",
                              isSelected ? " bg-yellow-200 text-orange-500 hover:bg-yellow-300" : "bg-blue-50 text-blue-800 hover:bg-blue-100")}>

            {/* Pokemon Move Button */}
            <div className="flex cursor-pointer">
                <div className="flex flex-1 py-1 text-[10px] justify-left items-center"
                     onClick={toggleDropdown}>   
                    {formattedName}
                </div>
                <div className="flex gap-2 justify-right items-center">
                    <button
                        ref={isSelected ? removeRef : addRef}
                        className={clsx("flex rounded-sm bg-[#2563eb] text-white hover:scale-110 cursor-pointer h-full",
                                        "justify-center items-center w-5",
                                        isSelected ? "text-orange-700 bg-yellow-500" : "text-[#2563eb]")}
                        onClick={isSelected ? handleRemove : handleAdd}
                    >
                    {isSelected ? "-" : "+"}
                    </button>
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