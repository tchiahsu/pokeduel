import clsx from 'clsx';

type PokedexButtonProps = {
    label: string;
    onClick: () => void;
    color: "red" | "blue" | "gray"
}

const PokedexButton = ({ label, onClick, color }: PokedexButtonProps) => {
    return (
        <button
            className={clsx("w-1/4 p-2  text-white text-xs font-medium rounded-lg cursor-pointer",
                            {
                                "bg-blue-600 hover:bg-blue-700": color === "blue",
                                "bg-gray-500 hover:bg-gray-700": color === "gray",
                                "bg-red-500 hover:bg-red-700": color === "red"
                            }
                    )}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export default PokedexButton;