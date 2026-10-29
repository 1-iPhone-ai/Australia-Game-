/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1026RhsEnergyBridge, V1026RhsTurnInput } from '../types/core';
import { readV1026RhsEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsEnergy20bcBridge(
  input: V1026RhsTurnInput,
  capacityStressIndex: number,
): V1026RhsEnergyBridge {
  return readV1026RhsEnergy20bcBridge(input.energy20bc, capacityStressIndex);
}

export function applyV1026RhsEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1026RhsEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1026_RHS_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
