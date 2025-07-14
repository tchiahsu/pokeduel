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

        console.log();
        const allPokemon: string[] = this.model.getAllPokemon();
        //this.view.display(allPokemon);
        console.log("Available Pokemon:");
        console.table(allPokemon);
        
        console.log();
        const player1Team: string[] = await this.inputReader.getPlayerTeamChoice();
        const player2Team: string[] = await this.inputReader.getPlayerTeamChoice();
        console.log()

        this.model.setPlayer1(player1Name, player1Team)
        this.model.setPlayer2(player2Name, player2Team)


        while (!this.model.isGameOver()) {
            const playerOptions = this.model.getPlayerOptions();
            // this.view.display(playerOptions);
            console.log(playerOptions[0]);
            let p1Move = await this.inputReader.getMove();
            let p1ParseMove = p1Move.split(" ");
            let p1FormattedMove = {action: p1ParseMove[0], index: parseInt(p1ParseMove[1])-1}
            while (this.model.isInvalidMove(1,p1FormattedMove)) {
                console.log("You tried to switch to the same Pokemon. Try again");
                p1Move = await this.inputReader.getMove();
                p1ParseMove = p1Move.split(" ");
                p1FormattedMove = {action: p1ParseMove[0], index: parseInt(p1ParseMove[1])-1}
            }

            console.log()
            console.log(playerOptions[1]);
            let p2Move = await this.inputReader.getMove(); 
            let p2ParseMove = p2Move.split(" ");
            let p2FormattedMove = {action: p2ParseMove[0], index: parseInt(p2ParseMove[1])-1}
            while (this.model.isInvalidMove(2,p2FormattedMove)) {
                console.log("You tried to switch to the same Pokemon. Try again");
                p2Move = await this.inputReader.getMove();
                p2ParseMove = p2Move.split(" ");
                p2FormattedMove = {action: p2ParseMove[0], index: parseInt(p2ParseMove[1])-1}
            }

            // Convert Attach option to object {action: <action>, index: <index>}
            this.model.handleTurn(p1FormattedMove, p2FormattedMove);

            const messages = this.model.getMessages();
            // this.view.display(messages);
            console.log("Turn results:");
            messages.forEach((message: string) => console.log(message));
            // console.log(messages);

            if (this.model.aPokemonHasFainted() && !this.model.isGameOver()) {
                const remainingPokemon = this.model.getRemainingPokemon();
                // this.view.display(remainingPokemon);
                console.log("Choose a replacement Pokemon:");
                console.log(`${this.model.getRemainingPokemon()}`);

                const switchIndex = await this.inputReader.getMove() // Index of pokemon they want
                const switchMove = {action: "switch", index: parseInt(switchIndex)-1};
                const switchMessage = this.model.handleFaintedPokemon(switchMove);
                // this.view.display(switchMessage);
                console.log(switchMessage);
            }
        }
        const endingMessage = this.model.getEndingMessage();
        // this.view.display(endingMessage);
        console.log(endingMessage);
    }
}