import { PassThrough } from "stream";
import Pokemon from "./Pokemon.js";

export default class StatusManager {

    public static checkIfCanMove(pokemon: Pokemon): string | null {
        const status = pokemon.getStatus();

        switch (status) {
            case "poison":
                // Pokemon 1/8th of max HP each turn
                const poisonDamage = Math.floor(pokemon.getMaxHP() / 8)
                pokemon.takeDamage(poisonDamage);
                return `${pokemon.getName()} is hurt by posion!`;
            case "sleep":
                pokemon.increaseStatusCounter();
                if (Math.random() < 0.33 || pokemon.getStatusCounter() == 3) { // 33% since the pokemon sleeps 1-3 turns
                    pokemon.setStatus("none")
                    pokemon.resetStatusCounter();
                    return `${pokemon.getName()} woke up!`;
                }
                return `${pokemon.getName()} is fast asleep!`;
            case "burn":
                // Pokemon Physical Attack Speed is cut by Half
                if (!pokemon.hasStatusApplied("burn")) {
                    pokemon.applyStatusEffect("burn");
                    const attack = Math.floor(pokemon.getAtk() / 2)
                    pokemon.lowerStat("spAtk", attack);
                }
                // Inflicts 1/16th of Max HP
                const burnDamage = Math.floor(pokemon.getMaxHP() / 16);
                pokemon.takeDamage(burnDamage);
                return `${pokemon.getName()} was inflicted with burn!`
            case "freeze":
                // The pokemon cannot use any attacks
                if (Math.random() < 0.2) { // 20% chance to get out
                    pokemon.setStatus("none")
                    return `${pokemon.getName()} thawed out!`;
                }
                return `${pokemon.getName()} is frozen!`;
            case "confuse":
                // The pokemon cannot attack between 1 to 4 turns
                pokemon.increaseStatusCounter();
                if (pokemon.getStatusCounter() > 4) {
                    pokemon.setStatus("none");
                    pokemon.resetStatusCounter();
                    return null
                }
                if (Math.random() < 0.33) { // 33% chance to be conffused
                    const selfHit = Math.floor(pokemon.getMaxHP() / 8);
                    pokemon.takeDamage(selfHit);
                    return `${pokemon.getName()} hurt itself in confusion!`
                }
                return null;
            case "paralyze":
                if (!pokemon.hasStatusApplied("paralyze")) {
                    pokemon.applyStatusEffect("paralyze");
                    const speed = Math.floor(pokemon.getSpeed() / 2);
                    pokemon.lowerStat("speed", speed)
                }
                if (Math.random() < 0.25) { // 25% chance to be fully paralyzed and unable to attack
                    return `${pokemon.getName()} is paralyzed and can't move!`
                }
                return null
        }

        return null; // No effect on pokemon
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
            return `${target.getName()} is now ${effect}!`;
        }

        if (targetType === "user") {
            user.setStatus(effect);
            user.resetStatusCounter();
            return `${user.getName()} is now ${effect}!`;
        }
        
        return null;
    }
}