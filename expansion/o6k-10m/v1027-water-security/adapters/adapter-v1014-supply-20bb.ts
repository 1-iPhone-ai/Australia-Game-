/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1027WsecTurnInput, V1027WsecSupplyBridge } from '../types/core';
import { readV1027WsecSupply20bbBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecSupply20bbBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecSupplyBridge {
  return readV1027WsecSupply20bbBridge(input.supply20bb, waterStressIndex);
}

export function applyV1027WsecSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1027WsecSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1027_WSEC_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
