/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1018FfedEnergyBridge, V1018FfedTurnInput } from '../types/core';
import { readV1018FfedEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1018_FFED_clamp } from '../engine/fiscal-federalism-utils';

export function computeV1018FfedEnergy20bcBridge(
  input: V1018FfedTurnInput,
  severityIndex: number,
): V1018FfedEnergyBridge {
  return readV1018FfedEnergy20bcBridge(input.energy20bc, severityIndex);
}

export function applyV1018FfedEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1018FfedEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1018_FFED_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
