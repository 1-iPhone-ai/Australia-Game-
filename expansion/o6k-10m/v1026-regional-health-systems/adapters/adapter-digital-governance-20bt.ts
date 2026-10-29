/**
 * Cross-wire: V1024 digital governance hospital network depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1026RhsTurnInput, V1026RhsSupplyBridge } from '../types/core';
import { readV1026RhsDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsDigitalGovernance20btBridge(
  input: V1026RhsTurnInput,
  capacityStressIndex: number,
): V1026RhsSupplyBridge {
  return readV1026RhsDigitalGovernance20btBridge(input.digitalGovernance20bt, capacityStressIndex);
}

export function applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1026RhsSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1026_RHS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
