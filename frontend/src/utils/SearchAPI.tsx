import type { Pokemon } from '../types/pokemon'

// Base URL for the backend server
const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Fetches the stats for a specific pokemon by name
 * @param name : the name of the pokemon we want to search
 * @returns A JSON object with the Pokemon stats or undefined if an error occurs
 */
export const searchPokeStats = async (name: string) => {
    try {
        const res = await fetch(`${API_URL_BASE}/pokemon/${name}/stats`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching Pokemon stats', e)
    }
};

/**
 * Fetches the moves for a specific pokemon by name
 * @param name : the name of the pokemon we want to search
 * @returns  A JSON object with the moves of the pokemon or undefined if an error occurs
 */
export const searchPokeMoves = async (name: string) => {
    try {
        const res = await fetch(`${API_URL_BASE}/pokemon/${name}/moves`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching Pokemon stats', e)
    }
};

/**
 * Fetches detailed information about a specific move by name
 * @param name : the name of the move
 * @returns A JSON object containing move stats or undefined if an error occurs
 */
export const searchMoveStats = async (name: string) => {
    try {
        console.log(name);
        const res = await fetch(`${API_URL_BASE}/moves/${name}`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching move data', e)
    }
}

/**
 * Fetch a single pokemon data by name
 * @param name : name of the pokemon
 * @returns a pokemon object { name, sprite } or null due to error
 */
export const fetchPokemonData = async (name: string): Promise<Pokemon | null> => {
    try {
        const res = await fetch(`${API_URL_BASE}/pokemon/${name}/stats`);
        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return {name: data.name, sprite: data.frontSprite};
    } catch (error) {
        console.error(`Fetch error: `, error);
        return null;
    }
};