/**
 * Cross-wire: V1029 inland heat depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function computeV1031GresCoastalResilience20byBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1031GresCoastalResilience20byBridge(input.inlandHeat20bz, gridStressExposureIndex);
}

export function applyV1031GresCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
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
