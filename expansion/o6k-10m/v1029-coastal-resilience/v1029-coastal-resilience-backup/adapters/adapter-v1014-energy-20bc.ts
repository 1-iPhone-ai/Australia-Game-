/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1029CresEnergyBridge, V1029CresTurnInput } from '../types/core';
import { readV1029CresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresEnergy20bcBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresEnergyBridge {
  return readV1029CresEnergy20bcBridge(input.energy20bc, seaLevelExposureIndex);
}

export function applyV1029CresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1029CresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1029_CRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
