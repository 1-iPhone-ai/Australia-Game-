/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1025BioEnergyBridge, V1025BioTurnInput } from '../types/core';
import { readV1025BioEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1025_BIO_clamp } from '../engine/biodiversity-stewardship-utils';

export function computeV1025BioEnergy20bcBridge(
  input: V1025BioTurnInput,
  ecosystemStressIndex: number,
): V1025BioEnergyBridge {
  return readV1025BioEnergy20bcBridge(input.energy20bc, ecosystemStressIndex);
}

export function applyV1025BioEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1025BioEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1025_BIO_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
