/**
 * Cross-wire: V1027 grid resilience basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresWaterSecurity20bwBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresWaterSecurity20bwBridge(input.gridResilience20ca, telecomStressExposureIndex);
}

export function applyV1032TresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
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
