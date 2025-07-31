import React, { useState } from 'react';

type HoverCardProps = {
    children: React.ReactNode;
    key?: number;
    hoverContent: any;
};

const HoverCard = ({ children, hoverContent }: HoverCardProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="flex flex-col items-center transition-all rounded-md p-2 cursor-pointer"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            {isVisible && (
                <div className="absolute bg-amber-400 z-10">
                    {hoverContent}
                </div>
            )}
        </div>
    );
};

export default HoverCard;