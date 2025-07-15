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
        const teamString = await this.prompt('Choose your team of 6 Pokemons (separated by a space): ')
        return teamString.split(/\s+/).map(name => name.trim());
    }

    async getAction(): Promise<string> {
        const action = (await this.prompt('Selection your move (Attack or Switch): ')).toLocaleLowerCase();
        return action;
    }

    async getActionArgument(action: string): Promise<number> {
        let argument: number;
        if (action === 'attack') {
            argument = parseInt(await this.prompt('Select attack ability: '));
        } else {
            argument = parseInt(await this.prompt('Select Pokemon: '));
        }
        return argument;
    }

    close(): void {
        this.rl.close();
    }
}