import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { computeProgressionSignalDelta } from './progression-signal-delta.js';

export interface ProgressionSignalDeltaDayCoach {
  dayDelta: number;
  interfaceLevelChanged: boolean;
  coachCopy: string | null;
}

export function buildProgressionSignalDeltaDayCoach(input: {
  prior: ProgressionSignalSnapshot;
  next: ProgressionSignalSnapshot;
  nextGameDay: number;
}): ProgressionSignalDeltaDayCoach {
  const delta = computeProgressionSignalDelta(input.prior, input.next);
  const coachCopy = delta.coachCopy ? `Day ${input.nextGameDay}: ${delta.coachCopy}` : null;
  return {
    dayDelta: delta.dayDelta,
    interfaceLevelChanged: delta.interfaceLevelChanged,
    coachCopy,
  };
}
