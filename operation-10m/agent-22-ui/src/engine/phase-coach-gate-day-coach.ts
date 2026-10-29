import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { CognitiveLoadBand } from './cognitive-load-governor.js';
import { phaseCoachGateCopy, planPhaseCoachSurfaces } from './phase-coach-gate.js';

export interface PhaseCoachGateDayCoach {
  suppressedSurfaceCount: number;
  coachCopy: string | null;
}

export function buildPhaseCoachGateDayCoach(input: {
  phase: V94StandardizedGamePhase;
  band: CognitiveLoadBand;
  nextGameDay: number;
}): PhaseCoachGateDayCoach {
  const plan = planPhaseCoachSurfaces(input.phase, input.band);
  const base = phaseCoachGateCopy(plan);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;

  return {
    suppressedSurfaceCount: plan.suppressedSurfaces.length,
    coachCopy,
  };
}
