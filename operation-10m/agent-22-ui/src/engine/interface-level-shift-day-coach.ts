import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { computeProgressionSignalDelta } from './progression-signal-delta.js';

export interface InterfaceLevelShiftDayCoach {
  interfaceLevelChanged: boolean;
  coachCopy: string | null;
}

export function buildInterfaceLevelShiftDayCoach(input: {
  prior: ProgressionSignalSnapshot;
  next: ProgressionSignalSnapshot;
  nextGameDay: number;
}): InterfaceLevelShiftDayCoach {
  const delta = computeProgressionSignalDelta(input.prior, input.next);
  if (!delta.interfaceLevelChanged) {
    return { interfaceLevelChanged: false, coachCopy: null };
  }
  return {
    interfaceLevelChanged: true,
    coachCopy: `Day ${input.nextGameDay}: Interface experience shifted from ${delta.priorInterfaceLevel} to ${delta.nextInterfaceLevel}.`,
  };
}
