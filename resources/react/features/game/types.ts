export type Player = {
  id: number;
  name: string;
  isSubmitted: boolean;
};

export type Me = {
  id: number;
  name: string;
  number: number;
};

export type Round = {
  roundNumber: number;
  topic: string;
  isActive: boolean;
};

export type Room = {
  id: number;
  lives: number;
  remainingLives: number;
  numberMin: number;
  numberMax: number;
  difficulty: "easy" | "normal" | "hard";
  totalRounds: number;
  status: "waiting" | "playing" | "finished";
};

export type Analogy = {
  playerId: number;
  playerName: string;
  text: string;
};

export type PlayedCard = {
  playerId: number;
  playerName: string;
  number: number;
  playedAt: string;
};

export type GameSettings = {
  lives: number;
  numberMin: number;
  numberMax: number;
  difficulty: "easy" | "normal" | "hard";
  totalRounds: number;
};
