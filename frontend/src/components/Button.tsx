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
    disabled?: boolean;
};

const Button = ({ children, onClick, size="sm", disabled=false }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx("bg-gray-300 text-gray-500 border-2 rounded-lg py-2 px-4",
                            `text-${size}`,
                            disabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-red-300 hover:text-red-600")}
        >
            {children}
        </button>
    );
};

export default Button;