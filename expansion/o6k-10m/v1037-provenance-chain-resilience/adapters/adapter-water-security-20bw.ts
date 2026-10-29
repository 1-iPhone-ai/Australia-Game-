/**
 * Cross-wire: V1027 information integrity resilience basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1037PcresTurnInput, V1037PcresSupplyBridge } from '../types/core';
import { readV1037PcresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresWaterSecurity20bwBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresSupplyBridge {
  return readV1037PcresWaterSecurity20bwBridge(input.informationIntegrityResilience20ci, custodyChainStressExposureIndex);
}

export function applyV1037PcresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1037PcresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1037_PCRS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.informationIntegrityResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
