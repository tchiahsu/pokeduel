// Defines a user in the Pokemon game
export type PlayerState = {
    playerName: string;
    roomID: string;
    setPlayerName: (name: string) => void;
    setRoomID: (value: string) => void;
};