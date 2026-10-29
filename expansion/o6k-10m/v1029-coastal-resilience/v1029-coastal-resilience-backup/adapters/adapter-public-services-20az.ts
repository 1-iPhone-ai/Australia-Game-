/**
 * Cross-wire: V1014 Climate adaptation / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1029CresTurnInput, V1029CresSupplyBridge } from '../types/core';
import { readV1029CresPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresPublicServices20azBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresSupplyBridge {
  return readV1029CresPublicServices20azBridge(input.publicServices20az, seaLevelExposureIndex);
}

export function applyV1029CresPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1029CresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1029_CRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
