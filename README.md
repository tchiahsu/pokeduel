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
- Player vs. AI
  
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
| Real-Time           | Tailwind CSS       |
| REST API            | Socket.IO          |
| Database Management | PostgreSQL         |

### Architecture Concept
```
Client A  <-------->  Socket.IO Server  <-------->  Client B
         :                    :
      REST API             PostgreSQL
```
### Game Engine Model
- All TypeScript / JavaScript
- Core Responsabilities:
   - Damage Calculation
   - Status effect tracking
   - Turn handling & validation
   - Logging game events
   - Determining win/loss
 
## Database: PostgreSQL
| DB Features           | Why PostgreSQL                           |
|-----------------------|------------------------------------------|
| Relational Structure  | Good for Users, Matches, Pokemon, Teams  |
| Strong Integrity      | Enforce constraints                      |
| Advanced Querying     | Useful for stats, leaderboards           |
| JSON Support          | If you want to store flexible data       |

### Potential Structure
- **Users**: id, username, password, email
- **Teams**: id, user_id, name
- **Pokemon**: id, name, type1, type2, base_stats, ability1, ..., etc
- **Matches**: id, player1_id, player2_id, winner_id, etc
- **Moves**: id, name, power, type, accuracy, speed, etc

## Hosting + Deployment (TBD)

## Stretch Goal
- AI Opponent
- Leaderboards
- Tournament Mode (like going to differnent Dojo like Ash did to get stars)

## Suggested Milestones
| Milestone      | Task                                          |
|----------------|-----------------------------------------------|
| Milestone #1   | Define game rules, plan structure of UI       |
| Milestone #2   | Implement game engine logic standalone        |
| Milestone #3   | Setup CI/CD Pipeline for frontend             |
| Milestone #4   | Build static frontend screens                 |
| Milestone #5   | Integrate frontend with game logic            |
| Milestone #6   | Add Socket.IO multiplayer logic               |
| Milestone #7   | Build database & REST endpoints               |
| Milestone #8   | Polish UI, test edge cases, write docs        |
| Milestone #9   | DEPLOY ... and add to Resume ;)               |


