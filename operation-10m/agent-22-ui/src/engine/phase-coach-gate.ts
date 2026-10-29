import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { CognitiveLoadBand } from './cognitive-load-governor.js';

export type PhaseCoachSurfaceId =
  | 'panel_unlock_coach'
  | 'onboarding_funnel'
  | 'progression_coverage'
  | 'keyboard_hints';

export interface PhaseCoachGatePlan {
  allowedSurfaces: PhaseCoachSurfaceId[];
  suppressedSurfaces: PhaseCoachSurfaceId[];
  phase: V94StandardizedGamePhase;
}

const ALWAYS_OFF_PHASES = new Set<V94StandardizedGamePhase>(['save_load', 'replay']);

const PHASE_ALLOWED: Partial<Record<V94StandardizedGamePhase, PhaseCoachSurfaceId[]>> = {
  main_menu: ['onboarding_funnel', 'keyboard_hints'],
  setup: ['onboarding_funnel', 'progression_coverage'],
  human_turn: ['panel_unlock_coach', 'onboarding_funnel', 'progression_coverage', 'keyboard_hints'],
  paused: ['panel_unlock_coach', 'progression_coverage', 'keyboard_hints'],
  approval_waiting: ['panel_unlock_coach', 'keyboard_hints'],
  ai_turn: ['progression_coverage'],
  post_match: ['progression_coverage'],
};

export function planPhaseCoachSurfaces(
  phase: V94StandardizedGamePhase,
  band: CognitiveLoadBand = 'moderate'
): PhaseCoachGatePlan {
  if (ALWAYS_OFF_PHASES.has(phase)) {
    return {
      phase,
      allowedSurfaces: [],
      suppressedSurfaces: ['panel_unlock_coach', 'onboarding_funnel', 'progression_coverage', 'keyboard_hints'],
    };
  }

  const base = PHASE_ALLOWED[phase] ?? ['progression_coverage'];
  let allowed = [...base];
  if (band === 'heavy') {
    allowed = allowed.filter(id => id !== 'panel_unlock_coach' && id !== 'onboarding_funnel');
  }

  const all: PhaseCoachSurfaceId[] = [
    'panel_unlock_coach',
    'onboarding_funnel',
    'progression_coverage',
    'keyboard_hints',
  ];
  const allowedSet = new Set(allowed);
  return {
    phase,
    allowedSurfaces: allowed,
    suppressedSurfaces: all.filter(id => !allowedSet.has(id)),
  };
}

export function isPhaseCoachSurfaceAllowed(plan: PhaseCoachGatePlan, surface: PhaseCoachSurfaceId): boolean {
  return plan.allowedSurfaces.includes(surface);
}

export function phaseCoachGateCopy(plan: PhaseCoachGatePlan): string | null {
  if (!plan.suppressedSurfaces.length) return null;
  return `Phase ${plan.phase}: ${plan.suppressedSurfaces.length} coaching surfaces deferred.`;
}
