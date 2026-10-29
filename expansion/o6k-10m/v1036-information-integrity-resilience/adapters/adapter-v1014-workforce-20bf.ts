/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1036IiresTurnInput, V1036IiresWorkforceBridge } from '../types/core';
import { readV1036IiresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1036_IIRES_clamp } from '../engine/information-integrity-resilience-utils';

export function computeV1036IiresWorkforce20bfBridge(
  input: V1036IiresTurnInput,
  attestationMeshStressExposureIndex: number,
): V1036IiresWorkforceBridge {
  return readV1036IiresWorkforce20bfBridge(input.workforce20bf, attestationMeshStressExposureIndex);
}

export function applyV1036IiresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1036IiresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1036_IIRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
