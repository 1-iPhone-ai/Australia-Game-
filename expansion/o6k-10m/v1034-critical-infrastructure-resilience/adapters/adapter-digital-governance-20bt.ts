/**
 * Cross-wire: V1024 digital governance facility zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1034CiresTurnInput, V1034CiresSupplyBridge } from '../types/core';
import { readV1034CiresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresDigitalGovernance20btBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresSupplyBridge {
  return readV1034CiresDigitalGovernance20btBridge(input.digitalGovernance20bt, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1034CiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1034_CIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
