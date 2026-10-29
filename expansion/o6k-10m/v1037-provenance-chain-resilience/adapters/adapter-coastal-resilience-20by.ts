/**
 * Cross-wire: V1029 information integrity resilience depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1037PcresTurnInput, V1037PcresSupplyBridge } from '../types/core';
import { readV1037PcresCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresCoastalResilience20byBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresSupplyBridge {
  return readV1037PcresCoastalResilience20byBridge(input.informationIntegrityResilience20ci, custodyChainStressExposureIndex);
}

export function applyV1037PcresCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
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
