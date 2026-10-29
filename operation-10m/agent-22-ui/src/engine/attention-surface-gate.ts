import type { CognitiveLoadBand } from './cognitive-load-governor.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  isAttentionSurfaceAllowed,
  planAttentionSurfaces,
  type AttentionBudgetPlan,
  type AttentionSurfaceCandidate,
  type AttentionSurfaceId,
} from './attention-budget-scheduler.js';

export interface AttentionSurfaceGateInput {
  band: CognitiveLoadBand;
  phase: V94StandardizedGamePhase;
  cognitiveLoadCoachRequested?: boolean;
  focusSessionBannerRequested?: boolean;
  panelUnlockCoachRequested?: boolean;
  simEvolutionBridgeRequested?: boolean;
  keyboardHintsRequested?: boolean;
}

const SURFACE_PRIORITIES: Record<AttentionSurfaceId, number> = {
  focus_session_banner: 1,
  cognitive_load_coach: 2,
  panel_unlock_coach: 3,
  sim_evolution_bridge: 4,
  keyboard_hints_overlay: 5,
};

export function buildAttentionSurfaceCandidates(input: AttentionSurfaceGateInput): AttentionSurfaceCandidate[] {
  const mk = (id: AttentionSurfaceId, requested?: boolean): AttentionSurfaceCandidate => ({
    id,
    priority: SURFACE_PRIORITIES[id],
    requested: Boolean(requested),
  });
  return [
    mk('focus_session_banner', input.focusSessionBannerRequested),
    mk('cognitive_load_coach', input.cognitiveLoadCoachRequested),
    mk('panel_unlock_coach', input.panelUnlockCoachRequested),
    mk('sim_evolution_bridge', input.simEvolutionBridgeRequested),
    mk('keyboard_hints_overlay', input.keyboardHintsRequested),
  ];
}

export function planAttentionSurfaceGate(input: AttentionSurfaceGateInput): AttentionBudgetPlan {
  return planAttentionSurfaces({
    band: input.band,
    phase: input.phase,
    candidates: buildAttentionSurfaceCandidates(input),
  });
}

export function isAttentionCoachSurfaceVisible(
  plan: AttentionBudgetPlan,
  surfaceId: AttentionSurfaceId
): boolean {
  return isAttentionSurfaceAllowed(plan, surfaceId);
}

export function attentionDeferralCopy(deferredIds: AttentionSurfaceId[]): string {
  if (!deferredIds.length) return '';
  if (deferredIds.length === 1) {
    return `One coaching surface is waiting (${deferredIds[0]}) until attention budget frees up.`;
  }
  return `${deferredIds.length} coaching surfaces are waiting until attention budget frees up.`;
}
