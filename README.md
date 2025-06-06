# Interactive Adventure Game

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)


## Overview
[add text]

## Features
- **TITLE** [DESCRIPTION]

## Running the Pokemon Battle Game

### Prerequisites
- ...

### Installation
1. Clone the repository
   ```
   git clone https://github.com/tchiahsu/interactive_adventure_game.git
   cd Interactive-Adventure-Game
   ```
   
2. Run the JAR file
   You should find `adventure_game.jar` inside.
   ```
   out/artifacts/adventure_game.jar/
   ```
   
3. In the terminal, choose your game mode:
   - Text-Based Mode:
     ```
     java -jar adventure_game.jar <absolute-path-to-game-file.json> -text
     ```
   - Graphical Mode:
     ```
     java -jar adventure_game.jar <absolute-path-to-game-file.json> -graphics
     ```
   - Batch Mode (Console Output):
     ```
     java -jar adventure_game.jar <absolute-path-to-game-file.json> -batch <source-file.txt>
     ```
   - Batch Mode (File Output):
     ```
     java -jar adventure_game.jar <absolute-path-to-game-file.json> -text <source-file.txt> <target-file.txt>
     ```
   > **Note:** JSON game files can be found under:
   > ```
   > src/data
   > ```

## Project Structure
```
Adventure_Game/
├── src/
|   ├── controller/  # Controllers (input handling / batch processing)
|   ├── model/       # Game Model (game logic)
|   ├── view/        # Game View (text and graphical components)
|   ├── data/        # JSON game files and images
├── out/             # Compiled artifacts and JAR files
├── pom.xml          # Maven configuration
└── README.md        # Project documentation
```
