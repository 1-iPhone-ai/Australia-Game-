/**
 * Cross-wire: V1029 sovereign cyber resilience depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1036IiresTurnInput, V1036IiresSupplyBridge } from '../types/core';
import { readV1036IiresCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresCoastalResilience20byBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresSupplyBridge {
  return readV1036IiresCoastalResilience20byBridge(input.sovereignCyberResilience20cg, attestationMeshStressExposureIndex);
}

export function applyV1036IiresCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
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
