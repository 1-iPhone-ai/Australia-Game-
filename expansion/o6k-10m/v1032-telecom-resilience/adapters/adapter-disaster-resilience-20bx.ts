/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresDisasterResilience20bxBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresDisasterResilience20bxBridge(input.disasterResilience20bx, telecomStressExposureIndex);
}

export function applyV1032TresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1032TresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1032_TRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
