const API_URL_BASE = 'http://localhost:8000';

export type Pokemon = {
        name: string;
        sprite: string;
};

export const searchPokeStats = async (name: string) => {
    try {
        const res = await fetch(`${API_URL_BASE}/pokemon/${name}/stats`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching Pokemon stats', e)
    }
};

export const searchPokeMoves = async (name: string) => {
    try {
        const res = await fetch(`${API_URL_BASE}/pokemon/${name}/moves`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching Pokemon stats', e)
    }
};

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
