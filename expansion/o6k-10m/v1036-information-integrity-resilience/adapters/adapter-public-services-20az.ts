/**
 * Cross-wire: V1014 Climate adaptation / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresPublicServices20azBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresPublicServices20azBridge(input.publicServices20az, attestationMeshStressExposureIndex);
}

export function applyV1036IiresPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
