/**
 * Cross-wire: V1024 digital governance facility zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1035CyresTurnInput, V1035CyresSupplyBridge } from '../types/core';
import { readV1035CyresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresDigitalGovernance20btBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresSupplyBridge {
  return readV1035CyresDigitalGovernance20btBridge(input.digitalGovernance20bt, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1035CyresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1035_CYRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
