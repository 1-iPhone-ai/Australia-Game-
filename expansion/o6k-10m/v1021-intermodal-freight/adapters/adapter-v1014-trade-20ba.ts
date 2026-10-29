/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1021ImfdTradeBridge, V1021ImfdTurnInput } from '../types/core';
import { readV1021ImfdTrade20baBridge } from './adapter-crosswire-hub';
import { V1021_IMFD_clamp } from '../engine/intermodal-freight-utils';

export function computeV1021ImfdTrade20baBridge(
  input: V1021ImfdTurnInput,
  iclogBackpressure: number,
): V1021ImfdTradeBridge {
  return readV1021ImfdTrade20baBridge(input.trade20ba, iclogBackpressure);
}

export function applyV1021ImfdTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1021ImfdTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1021_IMFD_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
