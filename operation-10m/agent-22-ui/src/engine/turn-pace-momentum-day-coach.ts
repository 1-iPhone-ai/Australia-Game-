import type { ProgressionSignalSnapshot } from '../types/progression.js';

export interface TurnPaceMomentumDayCoach {
  turnCount: number;
  gameDay: number;
  coachCopy: string | null;
}

export function buildTurnPaceMomentumDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): TurnPaceMomentumDayCoach {
  const { turnCount, gameDay } = input.signals;
  if (input.nextGameDay > 10 || gameDay < 2) {
    return { turnCount, gameDay, coachCopy: null };
  }
  if (turnCount < gameDay * 2) {
    return { turnCount, gameDay, coachCopy: null };
  }
  return {
    turnCount,
    gameDay,
    coachCopy: `Day ${input.nextGameDay}: Turn pace is high (${turnCount} turns by day ${gameDay}) — coach copy may defer to reduce overload.`,
  };
}
