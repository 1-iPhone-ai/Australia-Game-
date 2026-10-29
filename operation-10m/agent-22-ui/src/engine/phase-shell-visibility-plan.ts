import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { shouldShowEvolvingRailForPhase } from '../adapters/v94-phase-bridge.js';

export interface PhaseShellVisibilityPlan {
  phase: V94StandardizedGamePhase;
  showNavRail: boolean;
  showQuickActions: boolean;
  showDensityControl: boolean;
  showCoachSurfaces: boolean;
  coachCopy: string | null;
}

const QUICK_ACTION_PHASES = new Set<V94StandardizedGamePhase>(['human_turn', 'paused', 'approval_waiting']);

export function planPhaseShellVisibility(phase: V94StandardizedGamePhase): PhaseShellVisibilityPlan {
  const showNavRail = shouldShowEvolvingRailForPhase(phase);
  const showQuickActions = QUICK_ACTION_PHASES.has(phase);
  const showDensityControl = phase !== 'save_load' && phase !== 'replay';
  const showCoachSurfaces = phase === 'human_turn' || phase === 'paused' || phase === 'setup';

  let coachCopy: string | null = null;
  if (phase === 'save_load') {
    coachCopy = 'Save/load phase hides the evolving nav rail and quick actions.';
  } else if (phase === 'ai_turn') {
    coachCopy = 'During AI turns, coaching shells stay minimal until control returns.';
  } else if (!showQuickActions && showNavRail) {
    coachCopy = 'Quick actions are tucked away for this phase.';
  }

  return {
    phase,
    showNavRail,
    showQuickActions,
    showDensityControl,
    showCoachSurfaces,
    coachCopy,
  };
}

export function phaseShellVisibilitySummary(plan: PhaseShellVisibilityPlan): string {
  const parts: string[] = [];
  if (plan.showNavRail) parts.push('nav');
  if (plan.showQuickActions) parts.push('quick actions');
  if (plan.showCoachSurfaces) parts.push('coaches');
  return parts.length ? parts.join(', ') : 'minimal shells';
}
