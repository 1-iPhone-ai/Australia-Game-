/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1035CyresEnergyBridge, V1035CyresTurnInput } from '../types/core';
import { readV1035CyresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresEnergy20bcBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresEnergyBridge {
  return readV1035CyresEnergy20bcBridge(input.energy20bc, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1035CyresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1035_CYRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
