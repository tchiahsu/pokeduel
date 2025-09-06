import React from "react";
import Section from "./Section";

// import mainDefault from '../../assets/selection_steps/Default.png';
import switchPanel from "../../assets/battle_steps/Switch.png";
import initialBattlePage from "../../assets/battle_steps/Initial_Battle_Page.png";
import stats_card from "../../assets/battle_steps/Stats_card.png";
import battleDisplayPanel from "../../assets/battle_steps/BattleDisplayPanel.png";
import battleActionPanel from "../../assets/battle_steps/BattleActionPanel.png";
import moves from "../../assets/battle_steps/Moves.png";

const battleInstruction = [
  {
    title: "Battle Screen",
    content: [
      {
        description: "This is the core battle page where all the action happens.",
        bullet: [
          "Top Left: Opponent’s active Pokémon stats and Opponent's team's Poké Balls.",
          "Top Right: Opponent’s Pokémon sprite in the battlefield.",
          "Bottom Right: Your current Pokémon’s stats and your team’s Poké Balls.",
          "Bottom Left: Your active Pokémon sprite facing the opponent.",
          "Bottom Center: Battle Display Panel shows prompts and battle updates.",
          "Bottom Right Panel: Action buttons - Attack, Switch, or Quit the battle.",
        ],
        image: { src: initialBattlePage, alt: "Main Battle Page" },
      },
    ],
  },
  {
    title: "Stats Card",
    content: [
      {
        description:
          "Your and your opponent’s current Pokémon each have a stats card displayed in the corners of the screen.",
        bullet: [
          "Each Pokémon’s name and HP are shown with a visual progress bar.",
          "Poke Balls represent remaining team members: colored for active and grayed out for fainted.",
          "When a Pokémon faints, its HP bar reaches zero and its Poké Ball turns gray.",
        ],
        image: { src: stats_card, alt: "Stats Card" },
      },
    ],
  },
  {
    title: "Battle Display Panel",
    content: [
      {
        description: "This panel provides real-time updates during the battle.",
        bullet: [
          "Displays turn-by-turn messages such as attacks, damage, and Pokémon fainting.",
          "Helpful for tracking the battle flow and reviewing recent actions.",
        ],
        image: { src: battleDisplayPanel, alt: "Team Panel" },
      },
    ],
  },
  {
    title: "Action Buttons",
    content: [
      {
        description: "These buttons let you choose your action each turn.",
        bullet: [
          "Attack: Opens the Moves Panel to choose a move for your active Pokémon.",
          "Switch: Opens the Switch Panel to change your active Pokémon.",
          "Quit: Exit the battle and return to the Home page at any time.",
        ],
        image: { src: battleActionPanel, alt: "Actions Button Panel" },
      },
    ],
  },
  {
    title: "Moves Panel",
    content: [
      {
        description: "Choose from your active Pokémon’s moves when you select ‘Attack’.",
        bullet: [
          "Each move card displays the move’s name, type and remaining PP.",
          "Click a move to use it against the opponent’s Pokémon.",
          "The result of the move appears in the Battle Display Panel.",
        ],
        image: { src: moves, alt: "Display Moves Panel" },
      },
    ],
  },
  {
    title: "Switch Panel",
    content: [
      {
        description: "View your team and switch to another Pokémon mid-battle.",
        bullet: [
          "Each card shows the Pokémon’s name, type and current HP.",
          "Fainted Pokémon are grayed out and cannot be selected.",
          "Switching uses your turn and brings out the chosen Pokémon next round.",
        ],
        image: { src: switchPanel, alt: "Switch Panel" },
      },
    ],
  },
];

const BattleInstruction: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto items-center no-scrollbar">
      <h2 className="text-2xl">Pokemon Battle</h2>
      <div className="flex flex-col items-center text-[11px] text-gray-500 -mt-4 gap-1">
        <p>
          {`Engage in a turn-based battle using your selected team of up to 6 Pokémon. Choose moves, switch strategically and aim to defeat your opponent's team.`}
        </p>
        <p>{`Note: Some Pokémon sprites may be unavailable, in which case a unknown Pokémon will be shown.`}</p>
      </div>
      {battleInstruction.map((section) => (
        <Section title={section.title} content={section.content} />
      ))}
    </div>
  );
};

export default BattleInstruction;
