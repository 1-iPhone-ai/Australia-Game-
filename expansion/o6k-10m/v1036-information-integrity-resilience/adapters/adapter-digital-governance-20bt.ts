/**
 * Cross-wire: V1024 digital governance facility zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresDigitalGovernance20btBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresDigitalGovernance20btBridge(input.digitalGovernance20bt, attestationMeshStressExposureIndex);
}

export function applyV1036IiresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
