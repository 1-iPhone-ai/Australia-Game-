/**
 * Cross-wire: V1014 Climate adaptation exchange zone node depth (SECTION 20BR — exchange zone node bridge).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresClimateAdaptation20brBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresClimateAdaptation20brBridge(input.climateAdaptation20br, telecomStressExposureIndex);
}

export function applyV1032TresClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1032TresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1032_TRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
