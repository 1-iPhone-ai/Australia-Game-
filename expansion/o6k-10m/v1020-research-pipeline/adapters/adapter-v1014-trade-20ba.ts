/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1020RpipeTradeBridge, V1020RpipeTurnInput } from '../types/core';
import { readV1020RpipeTrade20baBridge } from './adapter-crosswire-hub';
import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils';

export function computeV1020RpipeTrade20baBridge(
  input: V1020RpipeTurnInput,
  transferPressure: number,
): V1020RpipeTradeBridge {
  return readV1020RpipeTrade20baBridge(input.trade20ba, transferPressure);
}

export function applyV1020RpipeTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1020RpipeTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1020_RPIPE_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
