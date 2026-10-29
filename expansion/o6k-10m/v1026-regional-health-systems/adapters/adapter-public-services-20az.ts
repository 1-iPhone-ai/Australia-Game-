/**
 * Cross-wire: V1014 Climate adaptation / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1026RhsTurnInput, V1026RhsSupplyBridge } from '../types/core';
import { readV1026RhsPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsPublicServices20azBridge(
  input: V1026RhsTurnInput,
  capacityStressIndex: number,
): V1026RhsSupplyBridge {
  return readV1026RhsPublicServices20azBridge(input.publicServices20az, capacityStressIndex);
}

export function applyV1026RhsPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1026RhsSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1026_RHS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
