/**
 * Cross-wire: V1027 sovereign cyber resilience basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresWaterSecurity20bwBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresWaterSecurity20bwBridge(input.sovereignCyberResilience20cg, attestationMeshStressExposureIndex);
}

export function applyV1036IiresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.sovereignCyberResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
