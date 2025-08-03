export interface GameInfo {
  ropePosition: number;
  team1Score: number;
  team2Score: number;
  maxScoreDifference: number;
  winner: number;
  totalPulls: number;
  gamesPlayed: number;
}

export interface TeamStats {
  score: number;
  isWinning: boolean;
  scoreAdvantage: number;
}

export interface GamePrediction {
  predictedWinner: number;
  confidence: number;
}

export interface GameEvent {
  type: 'pull' | 'win' | 'reset';
  player?: string;
  team?: number;
  timestamp: number;
}