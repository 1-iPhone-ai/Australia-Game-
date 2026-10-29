/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1027WsecEnergyBridge, V1027WsecTurnInput } from '../types/core';
import { readV1027WsecEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecEnergy20bcBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecEnergyBridge {
  return readV1027WsecEnergy20bcBridge(input.energy20bc, waterStressIndex);
}

export function applyV1027WsecEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1027WsecEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1027_WSEC_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
