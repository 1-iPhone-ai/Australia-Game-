/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1026RhsTurnInput, V1026RhsWorkforceBridge } from '../types/core';
import { readV1026RhsWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsWorkforce20bfBridge(
  input: V1026RhsTurnInput,
  capacityStressIndex: number,
): V1026RhsWorkforceBridge {
  return readV1026RhsWorkforce20bfBridge(input.workforce20bf, capacityStressIndex);
}

export function applyV1026RhsWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1026RhsWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1026_RHS_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
