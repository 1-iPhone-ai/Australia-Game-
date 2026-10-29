import type { CognitiveLoadBand } from './cognitive-load-governor.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  attentionDeferralCopy,
  planAttentionSurfaceGate,
} from './attention-surface-gate.js';

export interface AttentionDeferralDayCoach {
  deferredSurfaceCount: number;
  coachCopy: string | null;
}

export function buildAttentionDeferralDayCoach(input: {
  band: CognitiveLoadBand;
  phase: V94StandardizedGamePhase;
  nextGameDay: number;
  cognitiveLoadCoachRequested?: boolean;
  focusSessionBannerRequested?: boolean;
  panelUnlockCoachRequested?: boolean;
  simEvolutionBridgeRequested?: boolean;
  keyboardHintsRequested?: boolean;
}): AttentionDeferralDayCoach {
  const gate = planAttentionSurfaceGate({
    band: input.band,
    phase: input.phase,
    cognitiveLoadCoachRequested: input.cognitiveLoadCoachRequested,
    focusSessionBannerRequested: input.focusSessionBannerRequested,
    panelUnlockCoachRequested: input.panelUnlockCoachRequested,
    simEvolutionBridgeRequested: input.simEvolutionBridgeRequested,
    keyboardHintsRequested: input.keyboardHintsRequested,
  });
  const base = attentionDeferralCopy(gate.deferredIds);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    deferredSurfaceCount: gate.deferredIds.length,
    coachCopy,
  };
}
