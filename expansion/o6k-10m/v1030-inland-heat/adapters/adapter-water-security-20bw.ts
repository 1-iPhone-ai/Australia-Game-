/**
 * Cross-wire: V1027 coastal resilience basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1030IheatTurnInput, V1030IheatSupplyBridge } from '../types/core';
import { readV1030IheatWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatWaterSecurity20bwBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatSupplyBridge {
  return readV1030IheatWaterSecurity20bwBridge(input.coastalResilience20by, inlandHeatExposureIndex);
}

export function applyV1030IheatWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1030IheatSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1030_IHEAT_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.coastalResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
