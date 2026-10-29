/**
 * Cross-wire: V1014 Climate adaptation facility zone node depth (SECTION 20BR — facility zone node bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresClimateAdaptation20brBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresClimateAdaptation20brBridge(input.climateAdaptation20br, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1035CyresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1035_CYRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
