import { Link } from 'react-router-dom';
import selectionBg from '../assets/bg-field.jpg';

type Pokemon = {
        name: string;
        sprite: string;
    }

type Props = {
list: Pokemon[];
};

export default function Selection({ list }: Props) {
    return (
        <div className="relative min-h-screen min-w-screen flex flex-col">
            <img
                src={selectionBg}
                className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
            />
            {/* Team Selection Title */}
            <div className="relative max-h-[15vh]">
                <h3 className="text-3xl pokemon-h3 m-10 text-left">
                    Team Selection:
                </h3>
            </div>

            {/* Pokemon Selection Screen */}           
            <div className="flex max-h-[85vh]">
                {/* Left Panel */}
                <div className="flex-1 bg-gray-300 ml-6 mr-2 mb-6 rounded-lg opacity-80">
                    pokemon team go here
                </div>

                {/* Right Panel */}
                <div className="flex-12 bg-gray-300 mr-6 ml-2 mb-6 rounded-lg opacity-80 overflow-y-auto max-h-dvh">
                    <h4 className="text-xl font-bold mb-2">Available Pokemon</h4>
                    <div className="grid grid-cols-6 gap-6 p-4">
                        {list.map((poke, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center hover:bg-white hover:scale-105 transition-all rounded-md p-2 cursor-pointer"
                            >
                                <img src={poke.sprite} alt={poke.name} className="w-36 h-36" />
                                <span className="text-xs mt-1 capitalize">{poke.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
