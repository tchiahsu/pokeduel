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
            console.log(playerOptions[0]);
            const p1Move = await this.inputReader.getMove();

            console.log(playerOptions[1]);
            const p2Move = await this.inputReader.getMove();

            // Convert Attach option to object {action: <action>, index: <index>}
            const p1ParseMove = p1Move.split(" ");
            const p2ParseMove = p2Move.split(" ");
            const p1FormattedMove = {action: p1ParseMove[0], index: parseInt(p1ParseMove[1])-1}
            const p2FormattedMove = {action: p2ParseMove[0], index: parseInt(p2ParseMove[1])-1}
            this.model.handleTurn(p1FormattedMove, p2FormattedMove);

            const messages = this.model.getMessages();
            // this.view.display(messages);
            console.log("Turn results:");
            console.log(messages[0]);

            if (this.model.aPokemonHasFainted() && !this.model.isGameOver()) {
                const remainingPokemon = this.model.getRemainingPokemon();
                // this.view.display(remainingPokemon);
                console.log("Choose a replacement Pokemon:");
                console.log("remaining Pokemon: ");

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