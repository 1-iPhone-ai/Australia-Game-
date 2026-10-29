/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1029CresTurnInput, V1029CresSupplyBridge } from '../types/core';
import { readV1029CresSupply20bbBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresSupply20bbBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresSupplyBridge {
  return readV1029CresSupply20bbBridge(input.supply20bb, seaLevelExposureIndex);
}

export function applyV1029CresSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1029CresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1029_CRES_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
