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
            // this.view.display(playerOptions);
            console.log(playerOptions[0]);
            let p1Action = await this.inputReader.getAction();
            let p1Argument = await this.inputReader.getActionArgument(p1Action);
            let p1Object = {action: p1Action, index: p1Argument}
            while (this.model.isInvalidMove(1,p1Object)) {
                console.log("You tried to switch to the same Pokemon. Try again");
                p1Action = await this.inputReader.getAction();
                p1Argument = await this.inputReader.getActionArgument(p1Action);
                p1Object = {action: p1Action, index: p1Argument}
            }

            console.log();
            console.log(playerOptions[1]);
            let p2Action = await this.inputReader.getAction();
            let p2Argument = await this.inputReader.getActionArgument(p2Action);
            let p2Object = {action: p2Action, index: p2Argument}
            while (this.model.isInvalidMove(2,p2Object)) {
                console.log("You tried to switch to the same Pokemon. Try again");
                p2Action = await this.inputReader.getAction();
                p2Argument = await this.inputReader.getActionArgument(p2Action);
                p2Object = {action: p2Action, index: p2Argument}
            }

            // Convert Attach option to object {action: <action>, index: <index>}
            this.model.handleTurn(p1Object, p2Object);

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

                const switchIndex = await this.inputReader.getActionArgument('switch') // Index of pokemon they want
                const switchMove = {action: "switch", index: switchIndex};
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