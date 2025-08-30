/**
 * A type representing an event in the battle (attack, switch, faint, or status effect).
 * Used to animate battle actions and display messages to the players.
 */
export type Event = {
  user: string; // "self" | "opponent"
  animation: string; // "attack" | "switch" | "status" | "faint" | "none"
  message: string;
  attackData: attackData;
  switchData: switchData;
  onComplete?: () => void;
};

export type attackData = {
    newHP: number;
    type: string;
};

export type switchData = {
  name: string;
  hp: number;
  maxHP: number;
  backSprite: string;
  frontSprite: string;
};
