/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1024DgovTurnInput, V1024DgovSupplyBridge } from '../types/core';
import { readV1024DgovSupply20bbBridge } from './adapter-crosswire-hub';
import { V1024_DGOV_clamp } from '../engine/digital-governance-utils';

export function computeV1024DgovSupply20bbBridge(
  input: V1024DgovTurnInput,
  complianceStressIndex: number,
): V1024DgovSupplyBridge {
  return readV1024DgovSupply20bbBridge(input.supply20bb, complianceStressIndex);
}

export function applyV1024DgovSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1024DgovSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1024_DGOV_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
