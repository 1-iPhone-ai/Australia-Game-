/**
 * Cross-wire: V1024 digital governance substation zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function computeV1031GresDigitalGovernance20btBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1031GresDigitalGovernance20btBridge(input.digitalGovernance20bt, gridStressExposureIndex);
}

export function applyV1031GresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
