/**
 * Cross-wire: V1024 digital governance littoral zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1029CresTurnInput, V1029CresSupplyBridge } from '../types/core';
import { readV1029CresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresDigitalGovernance20btBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresSupplyBridge {
  return readV1029CresDigitalGovernance20btBridge(input.digitalGovernance20bt, seaLevelExposureIndex);
}

export function applyV1029CresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1029CresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1029_CRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
