import React from "react";

/**
 * Props for the InputBox component:
 * - placeholder: optional placeholder text
 * - value: the current string value bound to the input field
 * - onChange: event handler
 */
type InputBoxProps = {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnter?: () => Promise<void>;
};

const InputBox = ({ placeholder = "Enter text", value, onChange, onEnter }: InputBoxProps) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            maxLength={12}
            onChange={onChange}
            onKeyDown={(e) => {
                if (onEnter && e.key === "Enter") {
                    onEnter();
                }
            }}
            className="bg-gray-200 border-2 border-gray-400 rounded-lg py-2 px-4 text-gray-700
                       focus:outline-none focus:border-red-500 w-full"
        />
    );
};

export default InputBox;
