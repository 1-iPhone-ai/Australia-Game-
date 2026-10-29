/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1028DresTurnInput, V1028DresWorkforceBridge } from '../types/core';
import { readV1028DresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresWorkforce20bfBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresWorkforceBridge {
  return readV1028DresWorkforce20bfBridge(input.workforce20bf, disasterRiskIndex);
}

export function applyV1028DresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1028DresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1028_DRES_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
