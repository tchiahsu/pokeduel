import InputReader from './InputReader.js'

export default class BattleController {
    private model: any;
    // private view: any;
    private inputReader: InputReader;

    constructor(model: any) {
        this.model = model;
        // this.view = view;
        this.inputReader = new InputReader();
    }

    async go(): Promise<void> {
        // Initialize Player Names
        const player1Name: string = await this.inputReader.getPlayerName();
        const player2Name: string = await this.inputReader.getPlayerName();

        // Display Pokemon Selection
        console.log();
        const allPokemon: string[] = this.model.getAllPokemon();
        //this.view.display(allPokemon);
        console.log("Available Pokemon:");
        console.table(allPokemon);
        
        // Get Pokemon Team for each user
        let player1Team: string[];
        while (true) {
            player1Team = await this.inputReader.getPlayerTeamChoice();
            if (!this.model.isInvalidPokemon(player1Team, allPokemon)) break;
            console.log("Player 1 has selected invalid Pokemon. Please try again.")
        }

        let player2Team: string[];
        while (true) {
            player2Team = await this.inputReader.getPlayerTeamChoice();
            if (!this.model.isInvalidPokemon(player2Team, allPokemon)) break;
            console.log("Player 2 has selected invalid Pokemon. Please try again.")
        }

        console.log();
        this.model.setPlayer1(player1Name, player1Team)
        this.model.setPlayer2(player2Name, player2Team)


        while (!this.model.isGameOver()) {
            const playerOptions = this.model.getPlayerOptions();

            const p1Object = await this.getValidAction(1, playerOptions[0], player1Team, player2Team);
            console.log();
            const p2Object = await this.getValidAction(2, playerOptions[1], player1Team, player2Team);

            this.model.handleTurn(p1Object, p2Object);

            console.log("Turn result:")
            this.model.getMessages().forEach((message: string) => console.log(message));
            
            if (this.model.aPokemonHasFainted() && !this.model.isGameOver()) {
                console.log("Choose a replacement Pokemon:");
                console.log(this.model.getRemainingPokemon());

                while (true) {
                    const switchIndex = await this.inputReader.getActionArgument('switch') // Index of pokemon they want
                    
                    if (this.model.isInvalidIndex('switch', switchIndex, player1Team)) {
                        console.log("Invalid switch index. Try again.");
                        continue;
                    }
                    
                    const switchMove = {action: "switch", index: switchIndex - 1};

                    if (!this.model.isInvalidMove(1, switchMove)) {
                        const switchMessage = this.model.handleFaintedPokemon(switchMove);
                        console.log(switchMessage);
                        break;
                    }

                    console.log("Invalid switch move. Try again.")
                }
            }
        }
        console.log(this.model.getEndingMessage());
    }

    /**
     * Prompts a player for a valid action
     */
    private async getValidAction(player: number, options: string, player1Team: string[], player2Team: string[]): Promise<{ action: string; index: number }> {
        console.log(options);

        const currentPlayerTeam = player === 1 ? player1Team : player2Team;

        while (true) {
            const action = await this.inputReader.getAction();
            
            if (this.model.isInvalidAction(action)) {
                console.log("Invalid action. Please choose 'attack' or 'switch'.");
                continue;
            }

            const argument = await this.inputReader.getActionArgument(action);

            if (this.model.isInvalidIndex(action, argument, currentPlayerTeam)) {
                console.log(`Invalid index for action '${action}'. Please try again.`);
                continue;
            }

            const move = {action, index: argument - 1}

            // Validate move (same switch or 0 PP)
            if (!this.model.isInvalidMove(player, move)) {
                return move
            }
            console.log("Invalid move: Either switching to the same Pokémon or using a move with no PP. Try again.")
        }
    }
}