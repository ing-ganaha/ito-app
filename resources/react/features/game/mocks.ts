import type {
  Analogy,
  Me,
  PlayedCard,
  Player,
  Room,
  Round,
} from "@/features/game/types";

export const mockPlayers: Player[] = [
  { id: 1, isSubmitted: false, name: "Alice" },
  { id: 2, isSubmitted: false, name: "Bob" },
  { id: 3, isSubmitted: false, name: "Charlie" },
];

export const mockMe: Me = { id: 1, name: "Alice", number: 42 };

export const mockRound: Round = {
  isActive: true,
  roundNumber: 1,
  topic: "走るスピード",
};

export const mockRoom: Room = {
  difficulty: "normal",
  id: 1,
  lives: 3,
  numberMax: 100,
  numberMin: 1,
  remainingLives: 3,
  status: "playing",
  totalRounds: 3,
};

export const mockAnalogies: Analogy[] = [
  { playerId: 2, playerName: "Bob", text: "新幹線" },
  { playerId: 3, playerName: "Charlie", text: "自転車" },
];

export const mockPlayedCards: PlayedCard[] = [];
