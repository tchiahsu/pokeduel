type PokeMoveProps = {
    move: string | { name: string };
};

const PokeMove = ({ move }: PokeMoveProps) => {
    const moveName = 
        typeof move === "string" ? move : move.name
    
    const formattedName = moveName.replace(/-/g, " ");
    
    return (
        <div className="flex bg-blue-50 text-blue-800 px-3 py-1 rounded-xl font-medium capitalize hover:bg-blue-100 w-full text-left">
            <div className="flex-1">{formattedName}</div>
            <div className="flex gap-2">
                <button>-</button>
                <button>+</button>
            </div>
        </div>
    )
};

export default PokeMove;