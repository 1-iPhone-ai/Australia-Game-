import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { countIntroducedGuidedConcepts } from './guided-learning-panel-bridge.js';

export interface GuidedConceptCountDayCoach {
  conceptCount: number;
  coachCopy: string | null;
}

export function buildGuidedConceptCountDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
}): GuidedConceptCountDayCoach {
  const conceptCount = countIntroducedGuidedConcepts(input.signals);
  if (conceptCount <= 0) {
    return { conceptCount: 0, coachCopy: null };
  }
  const noun = conceptCount === 1 ? 'concept' : 'concepts';
  return {
    conceptCount,
    coachCopy: `Day ${input.nextGameDay}: ${conceptCount} guided learning ${noun} active — related panels stay highlighted.`,
  };
}
