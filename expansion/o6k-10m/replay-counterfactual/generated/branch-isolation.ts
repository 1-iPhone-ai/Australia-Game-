import { V1014_REPLAY_fingerprint, V1014_REPLAY_stableStringify } from './primitives';
import type {
  V1014ReplayBranchIsolationEnvelope,
  V1014ReplayCounterfactualBranch,
  V1014ReplayTurnCoordinate,
} from './types';
import { V1014_REPLAY_lookupCounterfactualPreset } from './counterfactual-preset-catalog.generated';

export interface V1014ReplayBranchIsolationInput {
  liveState: Record<string, unknown>;
  parentBranchNodeId: string;
  childBranchNodeId: string;
  presetId: string;
  forkCoordinate: V1014ReplayTurnCoordinate;
  rngStreamStates?: Record<string, unknown>;
}

export function V1014_REPLAY_createBranchIsolationEnvelope(
  input: V1014ReplayBranchIsolationInput,
): V1014ReplayBranchIsolationEnvelope {
  const sandbox = JSON.parse(V1014_REPLAY_stableStringify(input.liveState)) as Record<string, unknown>;
  const preset = V1014_REPLAY_lookupCounterfactualPreset(input.presetId);
  if (preset) {
    const overlay = (sandbox.overlay as Record<string, unknown>) || {};
    overlay[preset.presetId] = { paths: preset.overlayPaths, nonAuthoritative: true };
    sandbox.overlay = overlay;
  }
  const liveRef = V1014_REPLAY_fingerprint('live_ref', input.liveState);
  const sandboxRef = V1014_REPLAY_fingerprint('sandbox_ref', sandbox);
  return {
    envelopeId: V1014_REPLAY_fingerprint('isolation_envelope', { liveRef, sandboxRef }),
    liveStateRef: liveRef,
    sandboxStateRef: sandboxRef,
    parentBranchNodeId: input.parentBranchNodeId,
    childBranchNodeId: input.childBranchNodeId,
    rngStreamsCopied: Object.keys(input.rngStreamStates || {}).length,
    counterfactualOnly: true,
    corruptionGuard: {
      liveMutationsBlocked: true,
      reason: 'counterfactual sandbox — live state is read-only during what-if evaluation',
    },
  };
}

export function V1014_REPLAY_materializeCounterfactualBranch(
  presetId: string,
  forkCoordinate: V1014ReplayTurnCoordinate,
): V1014ReplayCounterfactualBranch | null {
  const preset = V1014_REPLAY_lookupCounterfactualPreset(presetId);
  if (!preset) return null;
  return {
    branchId: V1014_REPLAY_fingerprint('cf_branch', { presetId, forkCoordinate }),
    label: preset.label,
    forkCoordinate,
    presetId,
    overlayFingerprint: V1014_REPLAY_fingerprint('cf_overlay', preset.overlayPaths),
    authoritative: false,
  };
}

export function V1014_REPLAY_assertLiveStateUntouched(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): boolean {
  return V1014_REPLAY_fingerprint('live', before) === V1014_REPLAY_fingerprint('live', after);
}
