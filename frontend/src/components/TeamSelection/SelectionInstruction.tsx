import React from 'react';

interface SelectionInstruction {
  imageSrc: string;
  altText: string;
  description: string;
}

const selectionInstruction: SelectionInstruction[] = [
  {
    imageSrc: 'src/assets/selection_steps/main_page.png',
    altText: 'Main Team Selection Page',
    description: 'This is the team selection page where you can build a team of up to six Pokemon.',
  },
  {
    imageSrc: 'src/assets/selection_steps/default_pokemon.png',
    altText: 'Default Pokemon Area',
    description: 'Here you’ll find the default list of 151 Pokemon that you can add to your team.',
  },
  {
    imageSrc: 'src/assets/selection_steps/search.png',
    altText: 'Search Pokemon',
    description: 'Use the search bar to quickly find a specific Pokemon.',
  },
  {
    imageSrc: 'src/assets/selection_steps/Pokedex.png',
    altText: 'Pokedex',
    description: 'Clicking on a Pokémon opens its Pokédex card on the left, displaying stats and available moves.',
  },
  {
    imageSrc: 'src/assets/selection_steps/move_stat.png',
    altText: 'Move Stats',
    description: 'Click on a move to view its detailed stats.',
  },
  {
    imageSrc: 'src/assets/selection_steps/add_move.png',
    altText: 'Add Move',
    description: 'Click the + icon to select a move. You can choose up to 4 moves before adding the Pokemon to your team.',
  },
  {
    imageSrc: 'src/assets/selection_steps/randomize.png',
    altText: 'Randomize button',
    description: 'Use the "Randomize" button to generate a random team of 4 to 6 Pokemon.',
  }
];

const SelectionInstruction: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto pr-2">
      {selectionInstruction.map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center gap-3">
          <img
            src={step.imageSrc}
            alt={step.altText}
            className="w-full max-w-lg rounded-xl shadow-md"
          />
          <p className="text-gray-700 text-base">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SelectionInstruction;