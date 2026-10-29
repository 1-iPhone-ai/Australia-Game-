/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1017IclogTradeBridge, V1017IclogTurnInput } from '../types/core';
import { readV1017IclogTrade20baBridge } from './adapter-crosswire-hub';
import { V1017_ICLOG_clamp } from '../engine/intercity-logistics-utils';

export function computeV1017IclogTrade20baBridge(
  input: V1017IclogTurnInput,
  routePressure: number,
): V1017IclogTradeBridge {
  return readV1017IclogTrade20baBridge(input.trade20ba, routePressure);
}

export function applyV1017IclogTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1017IclogTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1017_ICLOG_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
