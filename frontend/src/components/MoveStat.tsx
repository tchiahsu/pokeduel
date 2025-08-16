import React from 'react';

/**
 * Props for the StatLine Prop
 * Displays one stat for a pokemon
 */
type MoveStatProps = {
    children: React.ReactNode;
}

const MoveStat = ({ children }: MoveStatProps) => {
    return (
        <div className="text-blue-950 text-[10px] indent-2 py-1 border-b border-gray-100">{children} </div>
    )
}

export default MoveStat;