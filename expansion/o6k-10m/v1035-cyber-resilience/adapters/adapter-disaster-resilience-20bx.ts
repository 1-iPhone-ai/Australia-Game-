/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresDisasterResilience20bxBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresDisasterResilience20bxBridge(input.disasterResilience20bx, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1035CyresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1035_CYRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
