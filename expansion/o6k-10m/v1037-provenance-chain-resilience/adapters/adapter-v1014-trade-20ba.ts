/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1037PcresTradeBridge, V1037PcresTurnInput } from '../types/core';
import { readV1037PcresTrade20baBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresTrade20baBridge(
  input: V1037PcresTurnInput,
  heatStressPressure: number,
): V1037PcresTradeBridge {
  return readV1037PcresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1037PcresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1037PcresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1037_PCRS_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
