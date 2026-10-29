/**
 * Cross-wire: V1014 Climate adaptation facility zone node depth (SECTION 20BR — facility zone node bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresClimateAdaptation20brBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresClimateAdaptation20brBridge(input.climateAdaptation20br, attestationMeshStressExposureIndex);
}

export function applyV1036IiresClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
