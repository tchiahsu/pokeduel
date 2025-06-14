/**
 * Creates a Pokemon with the passed-in stats.
 */
export default class Pokemon {
  constructor(pokemonStats) {
    Object.assign(this, pokemonStats);
  }

  getName() {
    return this.name;
  }

  getStat(stat) {
    return this[stat];
  }

  takeDamage(damage) {
    this.hp -= damage;
  }
}