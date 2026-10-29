/**
 * Cross-wire: V1025 regional health systems catchment depth (SECTION 20BV — basin integrity bridge).
 */
import type { V1028DresTurnInput, V1028DresSupplyBridge } from '../types/core';
import { readV1028DresBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresBiodiversityStewardship20buBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresSupplyBridge {
  return readV1028DresBiodiversityStewardship20buBridge(input.regionalHealthSystems20bv, disasterRiskIndex);
}

export function applyV1028DresBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1028DresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1028_DRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.regionalHealthDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
