import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { computeProgressionSignalDelta } from './progression-signal-delta.js';

export interface LargeDayJumpDayCoach {
  dayDelta: number;
  coachCopy: string | null;
}

export function buildLargeDayJumpDayCoach(input: {
  prior: ProgressionSignalSnapshot;
  next: ProgressionSignalSnapshot;
  nextGameDay: number;
  minDayDelta?: number;
}): LargeDayJumpDayCoach {
  const delta = computeProgressionSignalDelta(input.prior, input.next);
  const min = input.minDayDelta ?? 3;
  if (delta.interfaceLevelChanged || delta.dayDelta < min) {
    return { dayDelta: delta.dayDelta, coachCopy: null };
  }
  return {
    dayDelta: delta.dayDelta,
    coachCopy: `Day ${input.nextGameDay}: Large time jump (+${delta.dayDelta} days) — review newly unlocked panels.`,
  };
}
