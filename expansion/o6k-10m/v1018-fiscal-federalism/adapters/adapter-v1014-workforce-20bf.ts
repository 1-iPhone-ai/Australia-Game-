/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1018FfedTurnInput, V1018FfedWorkforceBridge } from '../types/core';
import { readV1018FfedWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1018_FFED_clamp } from '../engine/fiscal-federalism-utils';

export function computeV1018FfedWorkforce20bfBridge(
  input: V1018FfedTurnInput,
  severityIndex: number,
): V1018FfedWorkforceBridge {
  return readV1018FfedWorkforce20bfBridge(input.workforce20bf, severityIndex);
}

export function applyV1018FfedWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1018FfedWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1018_FFED_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
