/**
 * Cross-wire: V1029 grid resilience depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresCoastalResilience20byBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresCoastalResilience20byBridge(input.gridResilience20ca, telecomStressExposureIndex);
}

export function applyV1032TresCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
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
