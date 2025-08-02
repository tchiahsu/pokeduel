import React, { useState } from 'react';
import { searchPokeStats } from '../services/pokemon';

type HoverCardProps = {
    children: React.ReactNode;
    key?: number;
    pokeName: string;
};

const HoverCard = ({ children, pokeName }: HoverCardProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [pokeData, setPokeData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPokeStats = async () => {
        if (pokeData || isLoading) return;
        
        setIsLoading(true);
        try {
            const res = await searchPokeStats(pokeName);
            setPokeData(res);
        } catch (error) {
            console.error('Error fetching pokemon stats:', error);
            setPokeData(null);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="relative flex flex-col items-center hover:scale-105 transition-all p-2 cursor-pointer"
            onMouseEnter={() => {
                setIsVisible(true);
                fetchPokeStats();
            }}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            {isVisible && (
                <div className="absolute w-full h-full bg-[rgba(156,163,175,0.9)] z-10 rounded-md p-2 text-left text-xs">
                    {isLoading ? (
                        <div></div>
                    ) : pokeData ? (
                        <>
                            <div className="text-blue-950 text-center capitalize mb-3">{pokeData.name}</div>
                            <div className="text-blue-950 text-opa">Type: {pokeData.type || 'Unknown'}</div>
                            <div className="text-blue-950">HP: {pokeData.hp || '-'}</div>
                            <div className="text-blue-950">Attack: {pokeData.attack || '-'}</div>
                            <div className="text-blue-950">Defense: {pokeData.defense || '-'}</div>
                            <div className="text-blue-950">Sp. Attack: {pokeData["special-attack"] || '-'}</div>
                            <div className="text-blue-950">Sp. Defense: {pokeData["special-defense"] || '-'}</div>
                            <div className="text-blue-950">Speed: {pokeData.speed || '-'}</div>
                        </>
                    ) : (
                        <div>Failed to load data</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HoverCard;