import React from 'react';
import Section from './Section';

import mainDefault from '../../assets/selection_steps/Default.png';
import mainPage from '../../assets/selection_steps/Main_page.png';
import moveStats from '../../assets/selection_steps/Move_Stats.png';
import pokedex from '../../assets/selection_steps/Pokedex.png';
import search from '../../assets/selection_steps/Search.png';
import selectedMoves from '../../assets/selection_steps/Selected_moves.png';
import teamPanel from '../../assets/selection_steps/Team_Panel.png';
import topButtons from '../../assets/selection_steps/action_buttons.png';


const selectionInstruction = [
  {
    title: "Main Page",
    content: [
      {
        description: "Quick map of the screen:",
        bullet: [
          "Top: Action Buttons",
          "Left: Your Pokemon Team",
          "Right: Pokemon Selection Library"
        ],
        image: { src:mainPage, alt:"Main Page"}
      }
    ]
  },
  {
    title: "Action Buttons",
    content: [
      {
        description: "These control your session and kick things off when you’re ready.",
        bullet: [
          "Quit: Return to the Home page and end the current session.",
          "Clear: Remove all Pokemon from your team (resets Randomize).",
          "Randomize: Fill your team with a random selection (usable once until you Clear).",
          "Start: Begin the battle. Becomes yellow and enabled once you have at least 1 Pokemon."
        ],
        image: { src:topButtons, alt:"Action Buttons"}
      }
    ]
  },
  {
    title: "Pokemon Team",
    content: [
      {
        description: "Your chosen Pokemon appear here. A blue name marks your current Starter (the first to enter battle).",
        bullet: [
          "Hover a team Pokemon to: Set Starter, Edit (opens Pokedex), or Remove.",
          "Maximum team size is 6 Pokemon."
        ],
        image: { src:teamPanel, alt:"Team Panel"}
      }
    ]
  },
  {
    title: "Pokemon Selection",
    content: [
      {
        description: "Browse the library to pick your fighters. By default, you’ll see the first 150 Pokemon.",
        bullet: [
          "Need later generations? Use the search bar to find them by name.",
        ],
        image: { src:mainDefault, alt:"Pokemon Library"}
      },
      {
        description: "Search tips: enter the Pokemon’s name. If there’s a typo, you’ll see a ‘not found’ message.",
        bullet: [],
        image: { src:search, alt:"Search Bar"}
      },
      {
        description: "Click any Pokemon card to open the Pokedex on the right.",
        bullet: [],
        image: { src:pokedex, alt:"Select Pokemon"}
      }
    ]
  },
  {
    title: "Pokedex",
    content: [
      {
        description: "Inspect stats and customize moves before adding a Pokemon to your team.",
        bullet: [
          "Click a move name to view its details (power, accuracy, etc.).",
          "Click the + next to a move to select it for this Pokemon.",
          "Each Pokemon must have at least 1 move and at most 4 moves."
        ],
        image: { src:pokedex, alt:"Pokedex"}
      },
      {
        description: "Selected moves appear in the ‘Selected Moves’ area. Click − to remove a move.",
        bullet: [],
        image: { src:moveStats, alt:"Show Move Stats"}
      },
      {
        description: "Pokedex Controls (bottom buttons): manage moves and finalize your pick.",
        bullet: [
          "Close: Exit the Pokedex.",
          "Clear: Remove all selected moves for this Pokemon.",
          "Random: Auto-assign 4 random moves (overwrites current selection).",
          "Add: Add this Pokemon (with its selected moves) to your team."
        ],
        image: { src:selectedMoves, alt:"Select Moves"}
      }
    ]
  },
];

const SelectionInstruction: React.FC = () => {
  return (
    
    <div className="flex flex-col gap-6 overflow-y-auto items-center">
      <h2 className="text-2xl">Team Selection</h2>
      <p className="text-[11px] -mt-4 text-gray-500">
        {`Build a battle-ready team of up to 6 Pokemon, each tuned with a moveset of up to 4 moves.`}
      </p>
      {selectionInstruction.map((section) => (
        <Section 
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
  );
};

export default SelectionInstruction;