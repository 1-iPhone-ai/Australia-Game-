/**
 * Cross-wire: V1027 telecom resilience basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1033ScresTurnInput, V1033ScresSupplyBridge } from '../types/core';
import { readV1033ScresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresWaterSecurity20bwBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresSupplyBridge {
  return readV1033ScresWaterSecurity20bwBridge(input.telecomResilience20cb, logisticsStressExposureIndex);
}

export function applyV1033ScresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1033ScresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1033_SCRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.telecomResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
