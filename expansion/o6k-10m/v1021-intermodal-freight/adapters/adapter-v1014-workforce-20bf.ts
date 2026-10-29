/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1021ImfdTurnInput, V1021ImfdWorkforceBridge } from '../types/core';
import { readV1021ImfdWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1021_IMFD_clamp } from '../engine/intermodal-freight-utils';

export function computeV1021ImfdWorkforce20bfBridge(
  input: V1021ImfdTurnInput,
  dwellPenaltyIndex: number,
): V1021ImfdWorkforceBridge {
  return readV1021ImfdWorkforce20bfBridge(input.workforce20bf, dwellPenaltyIndex);
}

export function applyV1021ImfdWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1021ImfdWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1021_IMFD_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
