/**
 * Cross-wire: V1014 Climate adaptation protected area node depth (SECTION 20BR — protected area node bridge).
 */
import type { V1025BioTurnInput, V1025BioSupplyBridge } from '../types/core';
import { readV1025BioClimateAdaptation20brBridge } from './adapter-crosswire-hub';
import { V1025_BIO_clamp } from '../engine/biodiversity-stewardship-utils';

export function computeV1025BioClimateAdaptation20brBridge(
  input: V1025BioTurnInput,
  ecosystemStressIndex: number,
): V1025BioSupplyBridge {
  return readV1025BioClimateAdaptation20brBridge(input.climateAdaptation20br, ecosystemStressIndex);
}

export function applyV1025BioClimateAdaptation20brClimateAdaptationOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1025BioSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1025_BIO_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.climateAdaptationDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
