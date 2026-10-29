/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1029CresTurnInput, V1029CresWorkforceBridge } from '../types/core';
import { readV1029CresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresWorkforce20bfBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresWorkforceBridge {
  return readV1029CresWorkforce20bfBridge(input.workforce20bf, seaLevelExposureIndex);
}

export function applyV1029CresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1029CresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1029_CRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
