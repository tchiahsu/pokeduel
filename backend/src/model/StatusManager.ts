import Pokemon from "./Pokemon.js";

export default class StatusManager {

    public static checkIfCanMove(pokemon: Pokemon): string | null {
        const status = pokemon.getStatus();

        switch (status) {
            case "sleep":
                if (Math.random() < 0.33) { // 33% since the pokemon sleeps 1-3 turns
                    pokemon.setStatus("none")
                    return `${pokemon.getName()} woke up!`;
                }
                return `${pokemon.getName()} is fast asleep!`;
            case "frozen":
                if (Math.random() < 0.2) { // 20% chance to get out
                    pokemon.setStatus("none")
                    return `${pokemon.getName()} thawed out!`;
                }
                return `${pokemon.getName()} is frozen!`;
            case "paralyze":
                if (Math.random() < 0.25) { // 25% chance to be fully paralyzed
                    return `${pokemon.getName()} is paralyzed and can't move!`
                }
            case "confuse":
                if (Math.random() < 0.33) { // 33% chance to be conffused
                    return `${pokemon.getName()} hurt itself in confusion!`
                }
                break;
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
            return `${target.getName()} is now ${effect}!`;
        }

        if (targetType === "user") {
            user.setStatus(effect);
            return `${user.getName()} is now ${effect}!`;
        }
        
        return null;
    }
}