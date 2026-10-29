import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { CognitiveLoadBand } from './cognitive-load-governor.js';
import { planPhaseShellAttentionGate } from './phase-shell-attention-gate.js';

export interface PhaseShellAttentionDayCoach {
  deferredSurfaceCount: number;
  coachCopy: string | null;
}

export function buildPhaseShellAttentionDayCoach(input: {
  phase: V94StandardizedGamePhase;
  band: CognitiveLoadBand;
  persisted: EvolvingUiPersistedState;
  nextGameDay: number;
  simEvolutionBridgeRequested?: boolean;
  panelUnlockCoachRequested?: boolean;
}): PhaseShellAttentionDayCoach {
  const plan = planPhaseShellAttentionGate({
    phase: input.phase,
    band: input.band,
    persisted: input.persisted,
    gameDay: input.nextGameDay,
    simEvolutionBridgeRequested: input.simEvolutionBridgeRequested,
    panelUnlockCoachRequested: input.panelUnlockCoachRequested,
  });
  const coachCopy = plan.coachCopy ? `Day ${input.nextGameDay}: ${plan.coachCopy}` : null;
  return {
    deferredSurfaceCount: plan.deferredSurfaceCount,
    coachCopy,
  };
}
