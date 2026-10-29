/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1025BioTradeBridge, V1025BioTurnInput } from '../types/core';
import { readV1025BioTrade20baBridge } from './adapter-crosswire-hub';
import { V1025_BIO_clamp } from '../engine/biodiversity-stewardship-utils';

export function computeV1025BioTrade20baBridge(
  input: V1025BioTurnInput,
  heatStressPressure: number,
): V1025BioTradeBridge {
  return readV1025BioTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1025BioTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1025BioTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1025_BIO_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
