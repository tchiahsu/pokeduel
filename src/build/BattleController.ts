import InputReader from './InputReader.js'

export default class BattleController {
    private model: any;
    private inputReader: InputReader;

    constructor(model: any) {
        this.model = model;
        this.inputReader = new InputReader();
    }

    async go(): Promise<void> {
        // Initialize Player Names
        const player1Name: string = await this.inputReader.getPlayerName();
        const player2Name: string = await this.inputReader.getPlayerName();

        // Display Pokemon Selection
        console.log();
        const allPokemon: string[] = this.model.getAllPokemon();
        console.log("Available Pokemon:");
        console.table(allPokemon);
        console.log();
        
        // Get Pokemon Team for each user
        const player1Team = await this.getValidTeamChoice(1, allPokemon);
        const player2Team = await this.getValidTeamChoice(2, allPokemon);

        console.log();
        this.model.setPlayer1(player1Name, player1Team)
        this.model.setPlayer2(player2Name, player2Team)


        while (!this.model.isGameOver()) {

            const [options1, options2] = this.model.getPlayerOptions();
            
            const p1Move = await this.getValidAction(1, options1, player1Team);
            console.log();
            const p2Move = await this.getValidAction(2, options2, player2Team);

            this.model.handleTurn(p1Move, p2Move);

            console.log();
            console.log("Turn result: ");
            this.model.getMessages().forEach((message: string) => console.log(message));
            
            if (this.model.aPokemonHasFainted() && !this.model.isGameOver()) {
                await this.handleFaintedPokemon(player1Team, player2Team);
            }
        }
        console.log(this.model.getEndingMessage());
    }

    /**
     * Prompt the user to select a valid pokemon team
     * 
     * @param playerNumber : player number
     * @param allPokemon : list of pokemon
     */
    private async getValidTeamChoice(playerNumber: number, allPokemon: string[]): Promise<string[]> {
        while (true) {
            const team = await this.inputReader.getPlayerTeamChoice(playerNumber);
            if (!this.model.isInvalidPokemon(team, allPokemon)) return team;
            console.log(`Player ${playerNumber} has selected invalid Pokemon. Please try again.`)
        }
    }

    /**
     * Makes sure the user actions are valid within game parameters
     * 
     * @param player : player number
     * @param options : selection options
     * @param team : player team
     */
    private async getValidAction(player: number, options: string, team: string[]): Promise<{ action: string; index: number }> {
        console.log(options);

        while (true) {
            const action = await this.inputReader.getAction();
            
            if (this.model.isInvalidAction(action)) {
                console.log("Invalid action. Please choose 'attack' or 'switch'.");
                console.log();
                continue;
            }

            const argument = await this.inputReader.getActionArgument(action);

            if (this.model.isInvalidIndex(action, argument, team)) {
                console.log(`Invalid index for action '${action}'. Please try again.`);
                console.log();
                continue;
            }

            const move = {action, index: argument - 1}

            // Validate move (same switch or 0 PP)
            if (!this.model.isInvalidMove(player, move)) {
                return move
            }
            console.log("Invalid move: Either switching to the same Pokémon or using a move with no PP. Try again.")
            console.log()
        }
    }

    /**
     * Handles cases where the pokemon has fainted
     * @param player1Team : player 1 team
     * @param player2Team : player 2 team
     */
    private async handleFaintedPokemon(player1Team: string[], player2Team: string[]): Promise<void> {
        const faintedPlayer = this.model.getFaintedPlayer();
        const team = faintedPlayer === 1 ? player1Team : player2Team;

        console.log(`Player ${faintedPlayer}, choose a replacement Pokemon:`);
        console.log(this.model.getRemainingPokemon());

        while (true) {
            const index = await this.inputReader.getActionArgument('switch');

            if (this.model.isInvalidIndex('switch', index, team)) {
                console.log("Invalid switch index. Try again")
                continue;
            }

            const switchMove = {action: 'switch', index: index - 1};

            if (!this.model.isInvalidMove(1, switchMove)) {
                const message = this.model.handleFaintedPokemon(switchMove);
                console.log(message);
                return;
            }

            console.log("Invalid switch move. Try again.")
        }
    }
}