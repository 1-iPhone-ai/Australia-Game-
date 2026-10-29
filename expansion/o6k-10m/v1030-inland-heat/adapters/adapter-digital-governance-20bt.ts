/**
 * Cross-wire: V1024 digital governance inland zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1030IheatTurnInput, V1030IheatSupplyBridge } from '../types/core';
import { readV1030IheatDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatDigitalGovernance20btBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatSupplyBridge {
  return readV1030IheatDigitalGovernance20btBridge(input.digitalGovernance20bt, inlandHeatExposureIndex);
}

export function applyV1030IheatDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1030IheatSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1030_IHEAT_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
