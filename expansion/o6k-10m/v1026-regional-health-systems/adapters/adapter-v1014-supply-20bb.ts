/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1026RhsTurnInput, V1026RhsSupplyBridge } from '../types/core';
import { readV1026RhsSupply20bbBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsSupply20bbBridge(
  input: V1026RhsTurnInput,
  capacityStressIndex: number,
): V1026RhsSupplyBridge {
  return readV1026RhsSupply20bbBridge(input.supply20bb, capacityStressIndex);
}

export function applyV1026RhsSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1026RhsSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1026_RHS_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
