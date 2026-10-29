/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1016NresTurnInput, V1016NresWorkforceBridge } from '../types/core';
import { readV1016NresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1016_NRES_clamp } from '../engine/national-resilience-utils';

export function computeV1016NresWorkforce20bfBridge(
  input: V1016NresTurnInput,
  severityIndex: number,
): V1016NresWorkforceBridge {
  return readV1016NresWorkforce20bfBridge(input.workforce20bf, severityIndex);
}

export function applyV1016NresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1016NresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1016_NRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
