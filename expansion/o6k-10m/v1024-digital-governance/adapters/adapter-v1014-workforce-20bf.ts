/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1024DgovTurnInput, V1024DgovWorkforceBridge } from '../types/core';
import { readV1024DgovWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1024_DGOV_clamp } from '../engine/digital-governance-utils';

export function computeV1024DgovWorkforce20bfBridge(
  input: V1024DgovTurnInput,
  complianceStressIndex: number,
): V1024DgovWorkforceBridge {
  return readV1024DgovWorkforce20bfBridge(input.workforce20bf, complianceStressIndex);
}

export function applyV1024DgovWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1024DgovWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1024_DGOV_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
