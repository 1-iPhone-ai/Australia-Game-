import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { CognitiveLoadBand } from './cognitive-load-governor.js';
import {
  attentionDeferralCopy,
  planAttentionSurfaceGate,
} from './attention-surface-gate.js';

export interface AttentionSurfaceDayCoach {
  deferredSurfaceCount: number;
  coachCopy: string | null;
}

export function buildAttentionSurfaceDayCoach(input: {
  band: CognitiveLoadBand;
  phase: V94StandardizedGamePhase;
  nextGameDay: number;
  cognitiveLoadCoachRequested?: boolean;
  focusSessionBannerRequested?: boolean;
  panelUnlockCoachRequested?: boolean;
  simEvolutionBridgeRequested?: boolean;
  keyboardHintsRequested?: boolean;
}): AttentionSurfaceDayCoach {
  const plan = planAttentionSurfaceGate({
    band: input.band,
    phase: input.phase,
    cognitiveLoadCoachRequested: input.cognitiveLoadCoachRequested,
    focusSessionBannerRequested: input.focusSessionBannerRequested,
    panelUnlockCoachRequested: input.panelUnlockCoachRequested,
    simEvolutionBridgeRequested: input.simEvolutionBridgeRequested,
    keyboardHintsRequested: input.keyboardHintsRequested,
  });

  const base = attentionDeferralCopy(plan.deferredIds);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;

  return {
    deferredSurfaceCount: plan.deferredIds.length,
    coachCopy,
  };
}
