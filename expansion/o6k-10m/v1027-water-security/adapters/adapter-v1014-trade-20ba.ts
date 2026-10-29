/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1027WsecTradeBridge, V1027WsecTurnInput } from '../types/core';
import { readV1027WsecTrade20baBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecTrade20baBridge(
  input: V1027WsecTurnInput,
  heatStressPressure: number,
): V1027WsecTradeBridge {
  return readV1027WsecTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1027WsecTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1027WsecTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1027_WSEC_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
