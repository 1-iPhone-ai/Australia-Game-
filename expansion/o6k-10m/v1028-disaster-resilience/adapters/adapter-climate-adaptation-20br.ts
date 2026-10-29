/**
 * Cross-wire: V1014 Climate adaptation emergency response node depth (SECTION 20BR — emergency response node bridge).
 */
import type { V1028DresTurnInput, V1028DresSupplyBridge } from '../types/core';
import { readV1028DresClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresClimateAdaptation20brBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresSupplyBridge {
  return readV1028DresClimateAdaptation20brBridge(input.climateAdaptation20br, disasterRiskIndex);
}

export function applyV1028DresClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1028DresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1028_DRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
