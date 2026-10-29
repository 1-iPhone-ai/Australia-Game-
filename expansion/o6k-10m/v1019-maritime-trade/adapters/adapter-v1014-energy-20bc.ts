/**
 * Cross-wire: V1014 energy depth (SECTION 20BC).
 */
import type { V1019MtrdEnergyBridge, V1019MtrdTurnInput } from '../types/core';
import { readV1019MtrdEnergy20bcBridge } from './adapter-crosswire-hub';
import { V1019_MTRD_clamp } from '../engine/maritime-trade-utils';

export function computeV1019MtrdEnergy20bcBridge(
  input: V1019MtrdTurnInput,
  severityIndex: number,
): V1019MtrdEnergyBridge {
  return readV1019MtrdEnergy20bcBridge(input.energy20bc, severityIndex);
}

export function applyV1019MtrdEnergy20bcGridOverrides<T extends { gridStability?: number }>(
  base: T,
  bridge: V1019MtrdEnergyBridge,
): T {
  return {
    ...base,
    gridStability: V1019_MTRD_clamp((base.gridStability ?? 55) - bridge.gridDrag * 18, 0, 100),
  };
}
