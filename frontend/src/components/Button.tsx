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
    variant?: "default" | "start";
    disabled?: boolean;
};

const Button = ({ children, onClick, size="sm", variant="default", disabled=false }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx("border-2 rounded-lg py-2 px-4",
                            {
                                "text-xs": size === "xs",
                                "text-sm": size === "sm",
                                "text-md": size === "md",
                            },
                            {
                                "bg-gray-300 text-gray-500 hover:bg-red-300 hover:text-red-600": variant === "default",
                                "bg-yellow-200 text-yellow-500 animate-pulse-subtle hover:scale-105 duration-300 ease-in-out": variant === "start",
                            },
                            disabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer")}
        >
            {children}
        </button>
    );
};

export default Button;