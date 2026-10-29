/**
 * Cross-wire: V1024 digital governance exchange zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1032TresTurnInput, V1032TresSupplyBridge } from '../types/core';
import { readV1032TresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1032_TRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresDigitalGovernance20btBridge(
  input: V1032TresTurnInput,
  telecomStressExposureIndex: number,
): V1032TresSupplyBridge {
  return readV1032TresDigitalGovernance20btBridge(input.digitalGovernance20bt, telecomStressExposureIndex);
}

export function applyV1032TresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1032TresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1032_TRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
