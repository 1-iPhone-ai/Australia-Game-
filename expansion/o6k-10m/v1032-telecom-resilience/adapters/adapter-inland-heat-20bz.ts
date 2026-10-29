/**
 * Cross-wire: V1030 grid resilience depth (SECTION 20BZ — heatwave / arid-buffer bridge).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresInlandHeat20bzBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresInlandHeat20bzBridge(input.gridResilience20ca, telecomStressExposureIndex);
}

export function applyV1032TresInlandHeat20bzOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1032TresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1032_TRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.gridResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
