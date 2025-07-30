import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
};

const Button = ({ children, onClick, type="button", disabled=false }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-gray-300 text-gray-500 border-2 rounded-lg py-2 px-4 m-6
                ${disabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:bg-red-300 hover:text-red-600"}`}
        >
            {children}
        </button>
    );
};

export default Button;