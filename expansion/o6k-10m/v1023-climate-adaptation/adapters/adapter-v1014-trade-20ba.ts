/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1023CladTradeBridge, V1023CladTurnInput } from '../types/core';
import { readV1023CladTrade20baBridge } from './adapter-crosswire-hub';
import { V1023_CLAD_clamp } from '../engine/climate-adaptation-utils';

export function computeV1023CladTrade20baBridge(
  input: V1023CladTurnInput,
  packCohesionPressure: number,
): V1023CladTradeBridge {
  return readV1023CladTrade20baBridge(input.trade20ba, packCohesionPressure);
}

export function applyV1023CladTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1023CladTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1023_CLAD_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
