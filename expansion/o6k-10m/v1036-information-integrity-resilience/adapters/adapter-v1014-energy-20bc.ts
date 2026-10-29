/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1036IiresEnergyBridge, V1036IiresTurnInput } from '../types/core';
import { readV1036IiresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresEnergy20bcBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresEnergyBridge {
  return readV1036IiresEnergy20bcBridge(input.energy20bc, attestationMeshStressExposureIndex);
}

export function applyV1036IiresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1036IiresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1036_IIRES_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
