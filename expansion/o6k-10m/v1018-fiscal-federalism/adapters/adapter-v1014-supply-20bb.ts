/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1018FfedTurnInput, V1018FfedSupplyBridge } from '../types/core';
import { readV1018FfedSupply20bbBridge } from './adapter-crosswire-hub';
import { V1018_FFED_clamp } from '../engine/fiscal-federalism-utils';

export function computeV1018FfedSupply20bbBridge(
  input: V1018FfedTurnInput,
  severityIndex: number,
): V1018FfedSupplyBridge {
  return readV1018FfedSupply20bbBridge(input.supply20bb, severityIndex);
}

export function applyV1018FfedSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1018FfedSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1018_FFED_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
