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
        console.log();
        const player1Team: string[] = await this.inputReader.getPlayerTeamChoice();
        const player2Team: string[] = await this.inputReader.getPlayerTeamChoice();
        console.log()

        this.model.setPlayer1(player1Name, player1Team)
        this.model.setPlayer2(player2Name, player2Team)


        while (!this.model.isGameOver()) {
            const playerOptions = this.model.getPlayerOptions();

            const p1Object = await this.getValidAction(1, playerOptions[0]);
            console.log();
            const p2Object = await this.getValidAction(2, playerOptions[1]);

            this.model.handleTurn(p1Object, p2Object);

            console.log("Turn result:")
            this.model.getMessages().forEach((message: string) => console.log(message));
            
            if (this.model.aPokemonHasFainted() && !this.model.isGameOver()) {
                console.log("Choose a replacement Pokemon:");
                console.log(this.model.getRemainingPokemon());

                const switchIndex = await this.inputReader.getActionArgument('switch') // Index of pokemon they want
                const switchMove = {action: "switch", index: switchIndex};
                const switchMessage = this.model.handleFaintedPokemon(switchMove);
                console.log(switchMessage);
            }
        }
        console.log(this.model.getEndingMessage());
    }

    /**
     * Prompts a player for a valid action
     */
    private async getValidAction(player: number, options: string): Promise<{ action: string; index: number }> {
        console.log(options);

        while (true) {
            const action = await this.inputReader.getAction();
            const argument = await this.inputReader.getActionArgument(action);
            const move = {action, index: argument}

            if (!this.model.isInvalidAction(player, move)) {
                return move
            }
            
            console.log("You tried to switch to the same Pokemon. Try again");
        }
    }
}