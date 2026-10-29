/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1035CyresTurnInput, V1035CyresWorkforceBridge } from '../types/core';
import { readV1035CyresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1035_CYRES_clamp } from '../engine/cyber-resilience-utils';

export function computeV1035CyresWorkforce20bfBridge(
  input: V1035CyresTurnInput,
  sovereignDigitalStressExposureIndex: number,
): V1035CyresWorkforceBridge {
  return readV1035CyresWorkforce20bfBridge(input.workforce20bf, sovereignDigitalStressExposureIndex);
}

export function applyV1035CyresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1035CyresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1035_CYRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
