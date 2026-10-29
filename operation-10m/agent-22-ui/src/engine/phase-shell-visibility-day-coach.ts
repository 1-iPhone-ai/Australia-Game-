import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  phaseShellVisibilitySummary,
  planPhaseShellVisibility,
} from './phase-shell-visibility-plan.js';

export interface PhaseShellVisibilityDayCoach {
  phase: V94StandardizedGamePhase;
  dayAdvanced: boolean;
  coachCopy: string | null;
  shellSummary: string;
}

export function buildPhaseShellVisibilityDayCoach(input: {
  phase: V94StandardizedGamePhase;
  priorGameDay: number;
  nextGameDay: number;
}): PhaseShellVisibilityDayCoach {
  const plan = planPhaseShellVisibility(input.phase);
  const shellSummary = phaseShellVisibilitySummary(plan);
  const dayAdvanced = input.nextGameDay > input.priorGameDay;

  let coachCopy: string | null = null;
  if (dayAdvanced && plan.coachCopy) {
    coachCopy = `Day ${input.nextGameDay}: ${plan.coachCopy}`;
  } else if (dayAdvanced && input.nextGameDay <= 3) {
    coachCopy = `Day ${input.nextGameDay}: phase shells show ${shellSummary}.`;
  }

  return {
    phase: input.phase,
    dayAdvanced,
    coachCopy,
    shellSummary,
  };
}
