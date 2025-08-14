type PokeStatProps = {
    category: string;
    value: string | number | null;
}

const PokeStat = ({ category, value }: PokeStatProps) => {
    return (
        <div className="flex text-xs justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-700">{category}:</span>
            <span className="text-blue-950 font-semibold">{value || "NOT WORKING"}</span>
        </div>
    )
};

export default PokeStat;