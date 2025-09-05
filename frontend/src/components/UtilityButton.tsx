import React from "react";
import { clsx } from "clsx";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    hoverColor?: "yellow" | "red" | "blue";
};

const Button = ({ children, onClick, hoverColor="blue" }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-10 h-10 flex justify-center items-center rounded-full border-2",
                "bg-gray-300 text-gray-500 border-gray-500",
                "hover:scale-105 active:scale-90",
                {
                    "hover:bg-amber-300 hover:text-amber-500 hover:border-amber-500": hoverColor === "yellow",
                    "hover:bg-blue-300 hover:text-blue-600 hover:border-blue-600": hoverColor === "blue",  
                    "hover:bg-red-300 hover:text-red-600 hover:border-red-600": hoverColor === "red"
                }
            )}
        >
            {children}
        </button>
    )
}

export default Button;