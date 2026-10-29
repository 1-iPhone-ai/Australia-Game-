/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1037PcresEnergyBridge, V1037PcresTurnInput } from '../types/core';
import { readV1037PcresEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresEnergy20bcBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresEnergyBridge {
  return readV1037PcresEnergy20bcBridge(input.energy20bc, custodyChainStressExposureIndex);
}

export function applyV1037PcresEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1037PcresEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1037_PCRS_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
