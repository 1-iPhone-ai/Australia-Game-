/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1033ScresTurnInput, V1033ScresWorkforceBridge } from '../types/core';
import { readV1033ScresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1033_SCRES_clamp } from '../engine/supply-chain-resilience-utils';

export function computeV1033ScresWorkforce20bfBridge(
  input: V1033ScresTurnInput,
  logisticsStressExposureIndex: number,
): V1033ScresWorkforceBridge {
  return readV1033ScresWorkforce20bfBridge(input.workforce20bf, logisticsStressExposureIndex);
}

export function applyV1033ScresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1033ScresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1033_SCRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
