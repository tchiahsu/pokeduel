import React from "react";

type InputBoxProps = {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputBox = ({ placeholder = "Enter text", value, onChange }: InputBoxProps) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="bg-gray-200 border-2 border-gray-400 rounded-lg py-2 px-4 text-gray-700
                       focus:outline-none focus:border-gray-500 w-full"
        />
    );
};

export default InputBox;
