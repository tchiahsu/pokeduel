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
        const player1Name: string = await this.inputReader.getPlayerName();
        const player2Name: string = await this.inputReader.getPlayerName();

        const allPokemon: string[] = this.model.getAllPokemon();
        //this.view.display(allPokemon);
        console.log("Available Pokemon:");
        console.table(allPokemon);

        const player1Team: string[] = await this.inputReader.getPlayerTeamChoice();
        const player2Team: string[] = await this.inputReader.getPlayerTeamChoice();

        this.model.setPlayer1(player1Name, player1Team)
        this.model.setPlayer2(player2Name, player2Team)

        while (!this.model.isGameOver()) {
            const playerOptions = this.model.getPlayerOptions();
            // this.view.display(playerOptions);
            console.log("Available options:");
            console.log(playerOptions);

            const p1Move = await this.inputReader.getMove();
            const p2Move = await this.inputReader.getMove();
            this.model.handleTurn(p1Move, p2Move);

            const messages = this.model.getMessages();
            // this.view.display(messages);
            console.log("Turn results:");
            console.log(messages);

            if (this.model.aPokemonHasFainted() && !this.model.isGameOver()) {
                const remainingPokemon = this.model.getRemainingPokemon();
                // this.view.display(remainingPokemon);
                console.log("Choose a replacement Pokemon:");
                console.log("remainingPokemon");

                const switchMove = await this.inputReader.getMove() // Index of pokemon they want
                const switchMessage = this.model.handleFaintedPokemon(switchMove);
                // this.view.display(switchMessage);
                console.log(switchMessage);
            }

            const endingMessage = this.model.getEndingMessage();
            // this.view.display(endingMessage);
            console.log(endingMessage);
        }
    }
}