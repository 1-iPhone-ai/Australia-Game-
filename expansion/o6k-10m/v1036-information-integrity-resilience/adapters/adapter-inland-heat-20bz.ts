/**
 * Cross-wire: V1030 sovereign cyber resilience depth (SECTION 20BZ — heatwave / arid-buffer bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresInlandHeat20bzBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresInlandHeat20bzBridge(input.sovereignCyberResilience20cg, attestationMeshStressExposureIndex);
}

export function applyV1036IiresInlandHeat20bzOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1036IiresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1036_IIRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.sovereignCyberResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
