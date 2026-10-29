/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1022HaffTurnInput, V1022HaffSupplyBridge } from '../types/core';
import { readV1022HaffSupply20bbBridge } from './adapter-crosswire-hub';
import { V1022_HAFF_clamp } from '../engine/housing-affordability-utils';

export function computeV1022HaffSupply20bbBridge(
  input: V1022HaffTurnInput,
  rentStressIndex: number,
): V1022HaffSupplyBridge {
  return readV1022HaffSupply20bbBridge(input.supply20bb, rentStressIndex);
}

export function applyV1022HaffSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1022HaffSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1022_HAFF_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
