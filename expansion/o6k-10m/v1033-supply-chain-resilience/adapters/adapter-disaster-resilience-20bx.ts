/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1033ScresTurnInput, V1033ScresSupplyBridge } from '../types/core';
import { readV1033ScresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresDisasterResilience20bxBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresSupplyBridge {
  return readV1033ScresDisasterResilience20bxBridge(input.disasterResilience20bx, logisticsStressExposureIndex);
}

export function applyV1033ScresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1033ScresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1033_SCRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
