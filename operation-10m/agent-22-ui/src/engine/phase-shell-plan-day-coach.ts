import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  phaseShellVisibilitySummary,
  planPhaseShellVisibility,
} from './phase-shell-visibility-plan.js';

export interface PhaseShellPlanDayCoach {
  visibleShellRegionCount: number;
  shellSummary: string;
  coachCopy: string | null;
}

export function buildPhaseShellPlanDayCoach(input: {
  phase: V94StandardizedGamePhase;
  nextGameDay: number;
}): PhaseShellPlanDayCoach {
  const plan = planPhaseShellVisibility(input.phase);
  const shellSummary = phaseShellVisibilitySummary(plan);
  const visibleShellRegionCount = [
    plan.showNavRail,
    plan.showQuickActions,
    plan.showDensityControl,
    plan.showCoachSurfaces,
  ].filter(Boolean).length;

  let coachCopy: string | null = null;
  if (plan.coachCopy) {
    coachCopy = `Day ${input.nextGameDay}: ${plan.coachCopy} (${shellSummary}).`;
  } else if (visibleShellRegionCount > 0) {
    coachCopy = `Day ${input.nextGameDay}: phase shells show ${shellSummary}.`;
  }

  return {
    visibleShellRegionCount,
    shellSummary,
    coachCopy,
  };
}
