/**
 * Cross-wire: V1025 regional health systems catchment depth (SECTION 20BV — basin integrity bridge).
 */
import type { V1034CiresTurnInput, V1034CiresSupplyBridge } from '../types/core';
import { readV1034CiresBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresBiodiversityStewardship20buBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresSupplyBridge {
  return readV1034CiresBiodiversityStewardship20buBridge(input.regionalHealthSystems20bv, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1034CiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1034_CIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.regionalHealthDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
