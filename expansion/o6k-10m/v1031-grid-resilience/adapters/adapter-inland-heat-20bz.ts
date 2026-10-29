/**
 * Cross-wire: V1030 inland heat depth (SECTION 20BZ — heatwave / arid-buffer bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function computeV1031GresInlandHeat20bzBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1031GresInlandHeat20bzBridge(input.inlandHeat20bz, gridStressExposureIndex);
}

export function applyV1031GresInlandHeat20bzOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.inlandHeatDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
