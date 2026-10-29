import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { CognitiveLoadBand } from './cognitive-load-governor.js';
import { attentionDeferralCopy, planAttentionSurfaceGate } from './attention-surface-gate.js';
import { planPhaseShellVisibility } from './phase-shell-visibility-plan.js';
import { isCalmRecoveryActive } from './ui-calm-recovery-policy.js';

export interface PhaseShellAttentionGatePlan {
  phase: V94StandardizedGamePhase;
  showCoachSurfaces: boolean;
  calmRecoveryActive: boolean;
  attentionAllowedCount: number;
  deferredSurfaceCount: number;
  coachCopy: string | null;
}

export function planPhaseShellAttentionGate(input: {
  phase: V94StandardizedGamePhase;
  band: CognitiveLoadBand;
  persisted: EvolvingUiPersistedState;
  gameDay: number;
  simEvolutionBridgeRequested?: boolean;
  panelUnlockCoachRequested?: boolean;
}): PhaseShellAttentionGatePlan {
  const shell = planPhaseShellVisibility(input.phase);
  const calmRecoveryActive = isCalmRecoveryActive(input.persisted, input.gameDay);

  const candidatesRequested =
    shell.showCoachSurfaces &&
    !calmRecoveryActive &&
    (input.simEvolutionBridgeRequested !== false || input.panelUnlockCoachRequested !== false);

  const gate = planAttentionSurfaceGate({
    band: input.band,
    phase: input.phase,
    simEvolutionBridgeRequested: candidatesRequested && Boolean(input.simEvolutionBridgeRequested ?? true),
    panelUnlockCoachRequested: candidatesRequested && Boolean(input.panelUnlockCoachRequested ?? true),
    cognitiveLoadCoachRequested: candidatesRequested && !calmRecoveryActive,
    focusSessionBannerRequested: candidatesRequested && !calmRecoveryActive,
  });

  let coachCopy: string | null = shell.coachCopy;
  if (calmRecoveryActive) {
    coachCopy = 'Calm recovery hides coaching surfaces even when the phase would allow them.';
  } else if (!shell.showCoachSurfaces) {
    coachCopy = coachCopy ?? 'Phase shell hides coaching surfaces for this beat.';
  } else if (gate.deferredIds.length) {
    coachCopy = attentionDeferralCopy(gate.deferredIds);
  }

  return {
    phase: input.phase,
    showCoachSurfaces: shell.showCoachSurfaces,
    calmRecoveryActive,
    attentionAllowedCount: gate.allowedIds.length,
    deferredSurfaceCount: gate.deferredIds.length,
    coachCopy,
  };
}

export function phaseShellAttentionSummary(plan: PhaseShellAttentionGatePlan): string {
  if (plan.calmRecoveryActive) return 'calm recovery gating';
  if (!plan.showCoachSurfaces) return 'phase shell minimal';
  return `${plan.attentionAllowedCount} surfaces, ${plan.deferredSurfaceCount} deferred`;
}
