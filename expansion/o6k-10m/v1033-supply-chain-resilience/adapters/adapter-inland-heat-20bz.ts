/**
 * Cross-wire: V1030 telecom resilience depth (SECTION 20BZ — heatwave / arid-buffer bridge).
 */
import type { V1033ScresTurnInput, V1033ScresSupplyBridge } from '../types/core';
import { readV1033ScresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresInlandHeat20bzBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresSupplyBridge {
  return readV1033ScresInlandHeat20bzBridge(input.telecomResilience20cb, logisticsStressExposureIndex);
}

export function applyV1033ScresInlandHeat20bzOverrides<T extends { bottleneckPressure?: number }>(
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
