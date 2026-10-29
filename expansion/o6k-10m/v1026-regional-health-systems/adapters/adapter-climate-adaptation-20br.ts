/**
 * Cross-wire: V1014 Climate adaptation hospital network node depth (SECTION 20BR — hospital network node bridge).
 */
import type { V1026RhsTurnInput, V1026RhsSupplyBridge } from '../types/core';
import { readV1026RhsClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsClimateAdaptation20brBridge(
  input: V1026RhsTurnInput,
  capacityStressIndex: number,
): V1026RhsSupplyBridge {
  return readV1026RhsClimateAdaptation20brBridge(input.climateAdaptation20br, capacityStressIndex);
}

export function applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1026RhsSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1026_RHS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
