import { PassThrough } from "stream";
import Pokemon from "./Pokemon.js";

// Specify the return type
export type StatusResult = {
    message: string | null;
    canMove: boolean;
    endTurnEffect?: () => string | null;
}

export default class StatusManager {

    public static checkIfCanMove(pokemon: Pokemon): StatusResult {
        const status = pokemon.getStatus();

        switch (status) {
            case "poison":
                // Pokemon 1/8th of max HP each turn
                const poisonDamage = Math.floor(pokemon.getMaxHP() / 8)
                pokemon.takeDamage(poisonDamage);
                return {
                    message: null,
                    canMove: true,
                    endTurnEffect: () => {
                        pokemon.takeDamage(poisonDamage);
                        return `*${pokemon.getName()} is hurt by poison*`;
                    }
                };
            case "sleep":
                pokemon.increaseStatusCounter();
                if (Math.random() < 0.33 || pokemon.getStatusCounter() == 3) { // 33% since the pokemon sleeps 1-3 turns
                    pokemon.setStatus("none")
                    pokemon.resetStatusCounter();
                    return { message: `*${pokemon.getName()} woke up*`, canMove: true, };
                }
                return { message: `*${pokemon.getName()} is asleep!*`, canMove: false };
            case "burn":
                // Pokemon Physical Attack Speed is cut by Half
                if (!pokemon.hasStatusApplied("burn")) {
                    pokemon.applyStatusEffect("burn");
                }
                // Inflicts 1/16th of Max HP
                const burnDamage = Math.floor(pokemon.getMaxHP() / 16);
                return {
                    message: null,
                    canMove: true,
                    endTurnEffect: () => {
                        pokemon.takeDamage(burnDamage);
                        return `*${pokemon.getName()} is dealt burn damage*`
                    }
                }
            case "freeze":
                // The pokemon cannot use any attacks
                if (Math.random() < 0.2) { // 20% chance to get out
                    pokemon.setStatus("none")
                    return { message: `*${pokemon.getName()} thawed out*`, canMove: true }
                }
                return { message: `*${pokemon.getName()} is frozen*`, canMove: false }
            case "confuse":
                // The pokemon cannot attack between 1 to 4 turns
                pokemon.increaseStatusCounter();
                if (pokemon.getStatusCounter() > 4) {
                    pokemon.setStatus("none");
                    pokemon.resetStatusCounter();
                    return { message: null, canMove: true };
                }
                if (Math.random() < 0.33) { // 33% chance to be confused
                    const selfHit = Math.floor(pokemon.getMaxHP() / 8);
                    pokemon.takeDamage(selfHit);
                    return { message: `*${pokemon.getName()} damaged itself in confusion*`, canMove: false }
                }
                return { message: null, canMove: true };;
            case "paralyze":
                if (!pokemon.hasStatusApplied("paralyze")) {
                    pokemon.applyStatusEffect("paralyze");
                }
                if (Math.random() < 0.25) { // 25% chance to be fully paralyzed and unable to attack
                    return { message: `*${pokemon.getName()} is paralyzed and can't move*`, canMove: false }
                }
                return { message: null, canMove: true };

            default:
                return { message: null, canMove: true };
        }
    }

    public static tryApplyEffect(user: Pokemon, target: Pokemon, move: any): string | null {
        const effect = move.getEffect();
        const chance = move.getEffectChance();
        const targetType = move.getEffectTarget();

        if (effect === "none" || chance === 0) return null;
        if (Math.random() * 100 >= chance) return null;

        if (targetType === "target") {
            target.setStatus(effect);
            target.resetStatusCounter();
        }

        if (targetType === "user") {
            user.setStatus(effect);
            user.resetStatusCounter();
        }
        
        return null;
    }
}