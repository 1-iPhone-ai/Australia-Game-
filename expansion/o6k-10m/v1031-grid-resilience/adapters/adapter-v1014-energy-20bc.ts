/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1031GresEnergyBridge, V1031GresTurnInput } from '../types/core';
import { readV1031GresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function computeV1031GresEnergy20bcBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresEnergyBridge {
  return readV1031GresEnergy20bcBridge(input.energy20bc, gridStressExposureIndex);
}

export function applyV1031GresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1031GresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1031_GRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
