import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  buildCoachLandmarkReadingPlan,
  landmarkReadingCoachCopy,
} from './landmark-coach-plan.js';

export interface LandmarkReadingDayCoach {
  skipLinkCount: number;
  coachCopy: string | null;
}

export function buildLandmarkReadingDayCoach(input: {
  phase: V94StandardizedGamePhase;
  nextGameDay: number;
}): LandmarkReadingDayCoach {
  const plan = buildCoachLandmarkReadingPlan(input.phase);
  const base = landmarkReadingCoachCopy(plan);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;

  return {
    skipLinkCount: plan.skipLinkLabels.length,
    coachCopy,
  };
}
