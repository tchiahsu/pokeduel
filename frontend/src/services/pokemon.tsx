const API_URL_BASE = 'http://localhost:8000';

export type Pokemon = {
        name: string;
        sprite: string;
};

export const searchPokeStats = async (name: string) => {
    try {
        const res = await fetch(`${API_URL_BASE}/get-pokemon-data/${name}`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching Pokemon stats', e)
    }
};

export const searchPokeMoves = async (name: string) => {
    try {
        const res = await fetch(`${API_URL_BASE}/get-pokemon-moves/${name}`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching Pokemon stats', e)
    }
};