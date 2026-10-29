/**
 * Cross-wire: V1014 workforce migration v2 (SECTION 20BF).
 */
import type { V1037PcresTurnInput, V1037PcresWorkforceBridge } from '../types/core';
import { readV1037PcresWorkforce20bfBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresWorkforce20bfBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresWorkforceBridge {
  return readV1037PcresWorkforce20bfBridge(input.workforce20bf, custodyChainStressExposureIndex);
}

export function applyV1037PcresWorkforce20bfReadinessOverrides<T extends { nationalReadiness?: number }>(
  base: T,
  bridge: V1037PcresWorkforceBridge,
): T {
  return {
    ...base,
    nationalReadiness: V1037_PCRS_clamp((base.nationalReadiness ?? 52) + bridge.readinessDelta, 0, 100),
  };
}
