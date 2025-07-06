import movesData from "./moves.json" with {"type": "json"};

/**
 * Creates a Move with the passed in stats.
 */
export default class Move {
    private name: string;
    private type: string;
    private category: string;
    private power: number; 
    private accuracy: number; 
    private pp: number;

    /**
     * Constructs a new Move instance with the specified attributes.
     * @param type - The type of the move (e.g., Fire, Water, etc.)
     * @param category - The category of the move (e.g., Physical, Special, Status)
     * @param power - The power value of the move
     * @param accuracy - The accuracy percentage of the move
     * @param pp - The number of times the move can be used (Power Points)
     */
    constructor(name: string, type: string, category: string, power: number, accuracy: number, pp: number) {
        this.name = name;
        this.type = type;
        this.category = category;
        this.power = power;
        this.accuracy = accuracy;
        this.pp = pp;
    }

    /**
     * Gets the name of the move.
     * @returns The name as a string.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Gets the type of the move.
     * @returns The type as a string.
     */
    public getType(): string {
        return this.type;
    }

    /**
     * Gets the category of the move.
     * @returns The category as a string.
     */
    public getCategory(): string {
        return this.category;
    }

    /**
     * Gets the power of the move.
     * @returns The power as a number.
     */
    public getPower(): number {
        return this.power;
    }

    /**
     * Gets the accuracy of the move.
     * @returns The accuracy as a number.
     */
    public getAccuracy(): number {
        return this.accuracy;
    }

    /**
     * Reduces the move's PP (Power Points) by 1.
     * This represents using the move once.
     */
    public reducePP(): void {
        this.pp -= 1;
    }
}