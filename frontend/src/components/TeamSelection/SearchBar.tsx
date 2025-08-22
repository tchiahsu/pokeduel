type Props = {
    value: string;
    onChange: (val: string) => void;
    onEnter: () => Promise<void>;
};

export default function SearchBar({ value, onChange, onEnter }: Props) {
    return (
        <input
            type="text"
            placeholder="Search your Favorite Pokémon..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onEnter();
                }
            }}
            className="w-full h-11 px-4 border-1 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-red-500"
        />
    );
}
