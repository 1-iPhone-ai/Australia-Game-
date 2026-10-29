/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1024DgovEnergyBridge, V1024DgovTurnInput } from '../types/core';
import { readV1024DgovEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1024_DGOV_clamp } from '../engine/digital-governance-utils';

export function computeV1024DgovEnergy20bcBridge(
  input: V1024DgovTurnInput,
  complianceStressIndex: number,
): V1024DgovEnergyBridge {
  return readV1024DgovEnergy20bcBridge(input.energy20bc, complianceStressIndex);
}

export function applyV1024DgovEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1024DgovEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1024_DGOV_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
