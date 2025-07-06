import process from 'process';
import * as readline from 'readline';

export default class InputReader {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    private prompt(question: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async getPlayerName(): Promise<string> {
        const name = await this.prompt('Enter your player name: ');
        return name;
    }

    async getPlayerTeamChoice(): Promise<string[]> {
        const teamString = await this.prompt('Choose your team of 6 Pokemons (separated by comas): ')
        return teamString.split(',').map(name => name.trim());
    }

    async getMove(): Promise<string> {
        const move = await this.prompt('Enter your move (or switch choice): ');
        return move;
    }

    close(): void {
        this.rl.close();
    }
}