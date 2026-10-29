/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1029CresTurnInput, V1029CresSupplyBridge } from '../types/core';
import { readV1029CresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresDisasterResilience20bxBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresSupplyBridge {
  return readV1029CresDisasterResilience20bxBridge(input.disasterResilience20bx, seaLevelExposureIndex);
}

export function applyV1029CresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1029CresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1029_CRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
