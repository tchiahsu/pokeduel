import React from 'react';

import mainPage from '../../assets/selection_steps/main_page.png';
import pokedexEmpty from '../../assets/selection_steps/pokedex_empty.png';
import pokedexMoveStats from '../../assets/selection_steps/pokedex_move_details.png';
import pokedexMoveMax from '../../assets/selection_steps/pokedex_move_max.png';
import pokedexMoveSelected from '../../assets/selection_steps/pokedex_move_selected.png';
import pokedex from '../../assets/selection_steps/pokedex.png';
import searchBar from '../../assets/selection_steps/search_bar.png';
import buttonActive from '../../assets/selection_steps/selection_buttons_active.png';
import buttonInactive from '../../assets/selection_steps/selection_buttons.png';
import teamEdit from '../../assets/selection_steps/team_edit.png';
import teamStarter from '../../assets/selection_steps/team_starter.png';

interface SelectionInstruction {
  imageSrc: string;
  altText: string;
  description: string;
}

const selectionInstruction: SelectionInstruction[] = [
  {
    imageSrc: 'src/assets/selection_steps/main_page.png',
    altText: 'Top Bar Controls',
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