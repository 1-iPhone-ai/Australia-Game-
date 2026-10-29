/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1021ImfdTurnInput, V1021ImfdSupplyBridge } from '../types/core';
import { readV1021ImfdSupply20bbBridge } from './adapter-crosswire-hub';
import { V1021_IMFD_clamp } from '../engine/intermodal-freight-utils';

export function computeV1021ImfdSupply20bbBridge(
  input: V1021ImfdTurnInput,
  dwellPenaltyIndex: number,
): V1021ImfdSupplyBridge {
  return readV1021ImfdSupply20bbBridge(input.supply20bb, dwellPenaltyIndex);
}

export function applyV1021ImfdSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1021ImfdSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1021_IMFD_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
