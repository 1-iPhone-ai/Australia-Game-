/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1023CladEnergyBridge, V1023CladTurnInput } from '../types/core';
import { readV1023CladEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1023_CLAD_clamp } from '../engine/climate-adaptation-utils';

export function computeV1023CladEnergy20bcBridge(
  input: V1023CladTurnInput,
  heatStressIndex: number,
): V1023CladEnergyBridge {
  return readV1023CladEnergy20bcBridge(input.energy20bc, heatStressIndex);
}

export function applyV1023CladEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1023CladEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1023_CLAD_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
