/**
 * Cross-wire: V1014 national resilience v2 (SECTION 20BG).
 */
import type { V1017IclogTurnInput, V1017IclogResilienceBridge } from '../types/core';
import { readV1017IclogResilience20bgBridge } from './adapter-crosswire-hub';
import { V1017_ICLOG_clamp } from '../engine/intercity-logistics-utils';

export function computeV1017IclogResilience20bgBridge(
  input: V1017IclogTurnInput,
  severityIndex: number,
): V1017IclogResilienceBridge {
  return readV1017IclogResilience20bgBridge(input.resilience20bg, severityIndex);
}

export function applyV1017IclogResilience20bgContinuityOverrides<T extends { resilienceContinuityScore?: number }>(
  base: T,
  bridge: V1017IclogResilienceBridge,
): T {
  return {
    ...base,
    resilienceContinuityScore: V1017_ICLOG_clamp((base.resilienceContinuityScore ?? 52) + bridge.continuityDelta, 0, 100),
  };
}
