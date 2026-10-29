/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1030IheatTurnInput, V1030IheatWorkforceBridge } from '../types/core';
import { readV1030IheatWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatWorkforce20bfBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatWorkforceBridge {
  return readV1030IheatWorkforce20bfBridge(input.workforce20bf, inlandHeatExposureIndex);
}

export function applyV1030IheatWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1030IheatWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1030_IHEAT_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
