import React from "react";
import { clsx } from "clsx";

/**
 * Props for the Button component:
 * - children: content inside the button
 * - onClick: optional click handler function
 * - size: controls the size of the text inside the button
 * - disabled: disables the button and updates it style (optional)
 */
type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    size?: "xs" | "sm" | "md";
    variant?: "blue" | "yellow" | "red"
    disabled?: boolean;
};

const Button = ({ children, onClick, size="sm", variant="blue", disabled=false }: ButtonProps) => {
    
    const buttonSize = clsx({
        "text-xs": size === "xs",
        "text-sm": size === "sm",
        "text-md": size === "md",
    });

    return (
        <button
            onClick={onClick}
            className={clsx("border-2 rounded-lg py-2 px-4 min-w-[100px]",
                            "transition-transform duration-200 ease-in-out",
                            buttonSize,
                            disabled ? "bg-gray-300 text-gray-500 opacity-50 pointer-events-auto" :
                            {
                                "bg-gray-300 text-gray-500 hover:bg-blue-300 hover:text-blue-600 cursor-pointer": variant === "blue",
                                "bg-yellow-200 text-yellow-600 hover:scale-105 animate-pulse-subtle duration-200 ease-in-out shimmer cursor-pointer": variant === "yellow",
                                "bg-gray-300 text-gray-500 hover:bg-red-300 hover:text-red-600 cursor-pointer": variant === "red",
                            }
                        )}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;