/**
 * A utility class providing helper function to modify the
 * name of a pokemon
 */
export default class NameUtils {

    /**
     * Removes hyphens from pokemon name and makes it title case
     * @param name : name of pokemon
     * @returns polished pokemon name
     */
    public capitalize(name: string): string {
        return name
            .trim()
            .replace(/-/g, " ")
            .toLowerCase()
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
}