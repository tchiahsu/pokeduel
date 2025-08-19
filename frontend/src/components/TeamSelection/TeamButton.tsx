import clsx from 'clsx';

type TeamButtonProps = {
    label: string;
    onClick: () => void;
    color: "yellow" | "blue" | "purple" | "red" | "gray";
    disabled?: boolean;
}

const TeamButton = ({ label, onClick, color, disabled }:TeamButtonProps) => {
    return (
        <button
        className={clsx(
            "pointer-events-auto flex justify-center items-center text-[8px] rounded-full w-full h-1/3 p-2 transition-opacity duration-400 ease-in-out hover:scale-105 opacity-0 group-hover:opacity-100",
            {
            "bg-yellow-500 text-white": color === "yellow",
            "bg-blue-500 text-white": color === "blue",
            "bg-purple-500 text-white": color === "purple",
            "bg-red-500 text-white": color === "red",
            "bg-gray-700 text-gray-500": color === "gray",
            },
            disabled && "opacity-50 pointer-events-none"
        )}
        onClick={onClick}
        >
        {label}
        </button>
    )
}

export default TeamButton;