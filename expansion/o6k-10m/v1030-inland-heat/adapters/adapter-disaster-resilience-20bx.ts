/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1030IheatTurnInput, V1030IheatSupplyBridge } from '../types/core';
import { readV1030IheatDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatDisasterResilience20bxBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatSupplyBridge {
  return readV1030IheatDisasterResilience20bxBridge(input.disasterResilience20bx, inlandHeatExposureIndex);
}

export function applyV1030IheatDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1030IheatSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1030_IHEAT_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
