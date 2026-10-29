/**
 * Cross-wire: V1014 Climate adaptation / handoff depth (SECTION 20AZ — handoff bridge).
 */
import type { V1037PcresTurnInput, V1037PcresSupplyBridge } from '../types/core';
import { readV1037PcresPublicServices20azBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresPublicServices20azBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresSupplyBridge {
  return readV1037PcresPublicServices20azBridge(input.publicServices20az, custodyChainStressExposureIndex);
}

export function applyV1037PcresPublicServices20azServiceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1037PcresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1037_PCRS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.serviceQueueDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
