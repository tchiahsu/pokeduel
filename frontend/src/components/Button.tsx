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
    inactive?: boolean;
};

const Button = ({ children, onClick, size="sm", variant="default", inactive=false }: ButtonProps) => {
    
    const buttonSize = clsx({
        "text-xs": size === "xs",
        "text-sm": size === "sm",
        "text-md": size === "md",
    });

    const baseDisabled = "bg-gray-300 text-gray-500 opacity-80"
    const defaultEnabled = "bg-gray-300 text-gray-500 hover:bg-red-300 hover:text-red-600 cursor-pointer"
    const startEnbled = "bg-yellow-200 text-yellow-600 hover:scale-105 animate-pulse-subtle duration-200 ease-in-out cursor-pointer"

    const buttonVariant = variant === "default" ? (inactive ? baseDisabled : defaultEnabled) : (inactive ? baseDisabled : startEnbled)

    return (
        <button
            onClick={onClick}
            disabled={inactive}
            className={clsx("border-2 rounded-lg py-2 px-4",
                            "transition-transform duration-200 ease-in-out",
                            buttonSize,
                            buttonVariant,
                        )}
        >
            {children}
        </button>
    );
};

export default Button;