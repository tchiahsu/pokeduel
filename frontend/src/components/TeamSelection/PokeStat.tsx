/**
 * Props for the PokeStats component:
 * - category: the stat title/label
 * - value: the numeric or string value of the stat, or null if unavailable
 */
type PokeStatProps = {
    category: string;
    value: string | number | null;
}

/**
 * Displays a single pokemon stats the full length of the row
 */
const PokeStat = ({ category, value }: PokeStatProps) => {
    return (
        <div className="flex text-[10px] justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-700">{category}:</span>
            <span className="text-blue-950 font-semibold">{value || "NOT WORKING"}</span>
        </div>
    )
};

export default PokeStat;