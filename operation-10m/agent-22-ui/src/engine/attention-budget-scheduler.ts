import type { CognitiveLoadBand } from './cognitive-load-governor.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';

export type AttentionSurfaceId =
  | 'cognitive_load_coach'
  | 'focus_session_banner'
  | 'panel_unlock_coach'
  | 'sim_evolution_bridge'
  | 'keyboard_hints_overlay';

export interface AttentionSurfaceCandidate {
  id: AttentionSurfaceId;
  /** Lower number wins when budget is tight. */
  priority: number;
  requested: boolean;
}

export interface AttentionBudgetPlan {
  maxConcurrentSurfaces: number;
  allowedIds: AttentionSurfaceId[];
  deferredIds: AttentionSurfaceId[];
  bandHint: CognitiveLoadBand | 'unknown';
}

const BASE_SLOTS: Record<CognitiveLoadBand, number> = {
  light: 4,
  moderate: 3,
  heavy: 2,
};

export function resolveAttentionBudgetSlots(
  band: CognitiveLoadBand,
  phase: V94StandardizedGamePhase
): number {
  let slots = BASE_SLOTS[band];
  if (phase === 'human_turn') slots += 1;
  if (phase === 'save_load' || phase === 'main_menu') slots = Math.max(1, slots - 1);
  return Math.max(1, Math.min(5, slots));
}

export function planAttentionSurfaces(input: {
  band: CognitiveLoadBand;
  phase: V94StandardizedGamePhase;
  candidates: AttentionSurfaceCandidate[];
}): AttentionBudgetPlan {
  const maxConcurrentSurfaces = resolveAttentionBudgetSlots(input.band, input.phase);
  const active = input.candidates
    .filter(c => c.requested)
    .sort((a, b) => a.priority - b.priority);

  const allowedIds = active.slice(0, maxConcurrentSurfaces).map(c => c.id);
  const allowedSet = new Set(allowedIds);
  const deferredIds = active.filter(c => !allowedSet.has(c.id)).map(c => c.id);

  return {
    maxConcurrentSurfaces,
    allowedIds,
    deferredIds,
    bandHint: input.band,
  };
}

export function isAttentionSurfaceAllowed(
  plan: AttentionBudgetPlan,
  surfaceId: AttentionSurfaceId
): boolean {
  return plan.allowedIds.includes(surfaceId);
}
