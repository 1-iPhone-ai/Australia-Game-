/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1034CiresTurnInput, V1034CiresSupplyBridge } from '../types/core';
import { readV1034CiresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresDisasterResilience20bxBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresSupplyBridge {
  return readV1034CiresDisasterResilience20bxBridge(input.disasterResilience20bx, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1034CiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1034_CIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
