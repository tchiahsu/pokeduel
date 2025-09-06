import { clsx } from "clsx";

type InfoButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    active: boolean;
}

const InfoButton = ({ children, onClick, active }: InfoButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "text-xs px-8 py-2 min-w-1/3",
                active && "text-white rounded-lg bg-blue-500 duration-200 ease-in-out"
            )}

        >
            {children}
        </button>
    )
}

export default InfoButton;