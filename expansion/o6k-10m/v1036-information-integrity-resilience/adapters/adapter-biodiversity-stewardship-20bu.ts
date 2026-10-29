/**
 * Cross-wire: V1025 regional health systems catchment depth (SECTION 20BV — basin integrity bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresBiodiversityStewardship20buBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresBiodiversityStewardship20buBridge(input.regionalHealthSystems20bv, attestationMeshStressExposureIndex);
}

export function applyV1036IiresBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.regionalHealthDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
