/**
 * Cross-wire: V1027 water security basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1029CresTurnInput, V1029CresSupplyBridge } from '../types/core';
import { readV1029CresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresWaterSecurity20bwBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresSupplyBridge {
  return readV1029CresWaterSecurity20bwBridge(input.waterSecurity20bw, seaLevelExposureIndex);
}

export function applyV1029CresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1029CresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1029_CRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.waterSecurityDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
