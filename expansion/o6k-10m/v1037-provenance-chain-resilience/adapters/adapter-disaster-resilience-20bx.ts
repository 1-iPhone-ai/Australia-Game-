/**
 * Cross-wire: V1028 disaster resilience hazard depth (SECTION 20BX — compound hazard bridge).
 */
import type { V1037PcresTurnInput, V1037PcresSupplyBridge } from '../types/core';
import { readV1037PcresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresDisasterResilience20bxBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresSupplyBridge {
  return readV1037PcresDisasterResilience20bxBridge(input.disasterResilience20bx, custodyChainStressExposureIndex);
}

export function applyV1037PcresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1037PcresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1037_PCRS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
