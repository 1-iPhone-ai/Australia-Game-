/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1022HaffEnergyBridge, V1022HaffTurnInput } from '../types/core';
import { readV1022HaffEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1022_HAFF_clamp } from '../engine/housing-affordability-utils';

export function computeV1022HaffEnergy20bcBridge(
  input: V1022HaffTurnInput,
  rentStressIndex: number,
): V1022HaffEnergyBridge {
  return readV1022HaffEnergy20bcBridge(input.energy20bc, rentStressIndex);
}

export function applyV1022HaffEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1022HaffEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1022_HAFF_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
