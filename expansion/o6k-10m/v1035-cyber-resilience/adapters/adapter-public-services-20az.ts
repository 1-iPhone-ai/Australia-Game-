/**
 * Cross-wire: V1014 Climate adaptation / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresPublicServices20azBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresPublicServices20azBridge(input.publicServices20az, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1035CyresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1035_CYRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
