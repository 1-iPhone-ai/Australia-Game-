/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1032TresEnergyBridge, V1032TresTurnInput } from '../types/core';
import { readV1032TresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresEnergy20bcBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresEnergyBridge {
  return readV1032TresEnergy20bcBridge(input.energy20bc, telecomStressExposureIndex);
}

export function applyV1032TresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1032TresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1032_TRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
