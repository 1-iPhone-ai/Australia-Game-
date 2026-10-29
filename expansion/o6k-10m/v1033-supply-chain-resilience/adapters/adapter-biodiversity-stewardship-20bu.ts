/**
 * Cross-wire: V1025 regional health systems catchment depth (SECTION 20BV — basin integrity bridge).
 */
import type { V1033ScresTurnInput, V1033ScresSupplyBridge } from '../types/core';
import { readV1033ScresBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresBiodiversityStewardship20buBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresSupplyBridge {
  return readV1033ScresBiodiversityStewardship20buBridge(input.regionalHealthSystems20bv, logisticsStressExposureIndex);
}

export function applyV1033ScresBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1033ScresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1033_SCRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.regionalHealthDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
