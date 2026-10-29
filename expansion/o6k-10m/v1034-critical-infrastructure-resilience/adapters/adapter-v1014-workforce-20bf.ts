/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1034CiresTurnInput, V1034CiresWorkforceBridge } from '../types/core';
import { readV1034CiresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils';

export function computeV1034CiresWorkforce20bfBridge(
  input: V1034CiresTurnInput,
  cyberPhysicalStressExposureIndex: number,
): V1034CiresWorkforceBridge {
  return readV1034CiresWorkforce20bfBridge(input.workforce20bf, cyberPhysicalStressExposureIndex);
}

export function applyV1034CiresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1034CiresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1034_CIRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
