/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresDisasterResilience20bxBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresDisasterResilience20bxBridge(input.disasterResilience20bx, attestationMeshStressExposureIndex);
}

export function applyV1036IiresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
