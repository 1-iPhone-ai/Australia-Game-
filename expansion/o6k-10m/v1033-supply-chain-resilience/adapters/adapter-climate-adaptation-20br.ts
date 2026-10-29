/**
 * Cross-wire: V1014 Climate adaptation hub zone node depth (SECTION 20BR — hub zone node bridge).
 */
import type { V1033ScresTurnInput, V1033ScresSupplyBridge } from '../types/core';
import { readV1033ScresClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresClimateAdaptation20brBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresSupplyBridge {
  return readV1033ScresClimateAdaptation20brBridge(input.climateAdaptation20br, logisticsStressExposureIndex);
}

export function applyV1033ScresClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1033ScresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1033_SCRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
