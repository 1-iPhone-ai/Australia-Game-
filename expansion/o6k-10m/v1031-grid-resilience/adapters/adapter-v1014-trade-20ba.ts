/**
 * Cross-wire: V1014 trade depth (SECTION 20BA).
 */
import type { V1031GresTradeBridge, V1031GresTurnInput } from '../types/core';
import { readV1031GresTrade20baBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function computeV1031GresTrade20baBridge(
  input: V1031GresTurnInput,
  heatStressPressure: number,
): V1031GresTradeBridge {
  return readV1031GresTrade20baBridge(input.trade20ba, heatStressPressure);
}

export function applyV1031GresTrade20baLaneOverrides<T extends { exportLaneStability?: number }>(
  base: T,
  bridge: V1031GresTradeBridge,
): T {
  return {
    ...base,
    exportLaneStability: V1031_GRES_clamp((base.exportLaneStability ?? 50) + bridge.laneStabilityDelta, 0, 100),
  };
}
