import React from 'react';
import Section from './Section';

import homePage from "../../assets/homepage_steps/mainpage.png";
import soloPage from "../../assets/homepage_steps/solobattle.png";
import multiPage from "../../assets/homepage_steps/multiplayer.png";
import multiCreatePage from "../../assets/homepage_steps/multiplayer_create.png";
import multiJoinPage from "../../assets/homepage_steps/multiplayer_join.png";


const mainInstruction = [
  {
    title: "Main Page",
    content: [
      {
        description: "Choose how you want to play! The Home Page lets you pick between Solo Battle or Multiplayer Mode. Before continuing, you must enter your name — without it you cannot proceed.",
        bullet: [
          "Solo Battle: Play against the computer.",
          "Multiplayer: Play with friends by creating or joining a game room.",
        ],
        image: { src:homePage, alt:"Home Page"}
      }
    ]
  },
  {
    title: "Solo Battle Mode",
    content: [
      {
        description: "Battle the computer with your own custom team. Once you enter your name, you can start immediately.",
        bullet: [
          "Add your name: Required before you can proceed.",
          "Start: Takes you directly to Team Selection.",
          "Computer Team: Automatically chosen by the system.Randomize: Fill your team with a random selection (usable once until you Clear).",
          "Goal: Build your team of up to 6 Pokémon, then battle!"
        ],
        image: { src:soloPage, alt:"Solo Battle Page"}
      }
    ]
  },
  {
    title: "Multiplayer Mode",
    content: [
      {
        description: "Challenge your friends in real time. After entering your name, choose whether to create a game or join one.",
        bullet: [
          "Add your name: Required to continue.",
          "Create Room: Generate a new room code to share with friends.",
          "Join Room: Enter your friend’s room code to connect.",
          "Note: Even if you don’t copy the room code, you’ll see it again in the Team Selection page."
        ],
        image: { src:multiPage, alt:"MultiPlayer Page"}
      },
      {
        description: "Creating a room lets you host the battle. Share your room code so others can join.",
        bullet: [
          "Room Code: Copy and share with friends.",
          "Team Selection: Proceed once at least one friend has joined."
        ],
        image: { src:multiCreatePage, alt:"Create Game"}
      },
      {
        description: "Joining a room connects you to a friend’s game. Make sure they share their room code with you.",
        bullet: [
          "Enter Room Code: Type the code exactly as given.",
          "Team Selection: Once connected, move on to pick your team."
        ],
        image: { src:multiJoinPage, alt:"Join Game"}
      }
    ]
  }
];

const MainInstruction: React.FC = () => {
  return (
    
    <div className="flex flex-col gap-6 overflow-y-auto items-center">
      <h2 className="text-2xl">Home Page</h2>
      <p className="text-[11px] -mt-4 text-gray-500">
        {`Welcome to the Hub! Select your game mode and jump into a game!`}
      </p>
      {mainInstruction.map((section) => (
        <Section 
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
  );
};

export default MainInstruction;