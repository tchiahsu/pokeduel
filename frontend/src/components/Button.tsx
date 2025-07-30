import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
};

const Button = ({ children, onClick, type="button"}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="bg-gray-300 text-gray-500 border-2 rounded-lg py-2 px-4 m-6
                       hover:bg-red-300 hover:text-red-600"
        >
            {children}
        </button>
    );
};

export default Button;