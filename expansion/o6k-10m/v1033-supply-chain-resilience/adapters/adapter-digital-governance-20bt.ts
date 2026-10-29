/**
 * Cross-wire: V1024 digital governance hub zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1033ScresTurnInput, V1033ScresSupplyBridge } from '../types/core';
import { readV1033ScresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresDigitalGovernance20btBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresSupplyBridge {
  return readV1033ScresDigitalGovernance20btBridge(input.digitalGovernance20bt, logisticsStressExposureIndex);
}

export function applyV1033ScresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1033ScresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1033_SCRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
