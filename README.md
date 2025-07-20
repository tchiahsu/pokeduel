# PokeDuel: A Pokemon Battle Game

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Game Design & Core Mechanics

### Core Loop
- Player selected 6 Pokemon
- Each round is 1v1 turn-based (turns are determined by attack speed)
- Moves are selected via GUI (keyboard or mouse click)
- You can switch Pokemon during your turn (takes precedence over attack speed)
- 30 second timer to pick attack otherwise its randomized
- Win condition: all of a player's pokemon have fainted
  
### Player Modes
- Player vs. Player
  
## Frontend Tech Stack
| Purpose          | Tech                 |
|------------------|----------------------|
| Framework        | React (W/TypeScript) |
| Styling          | Tailwind CSS         |
| State Management | Redux Toolkit        |
| Real-time Events | Socket.io            |

### Important Features
- Pokemon selection screen
- Battle arena screen
- Hover tooltips for move stats
- Timer / Countdown
- Chat window ???

## Backend
| Component           | Tech               |
|---------------------|--------------------|
| Framework           | Node.js + Express  |
| REST API            | Socket.IO          |


