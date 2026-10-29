/**
 * Cross-wire: V1030 information integrity resilience depth (SECTION 20BZ — heatwave / arid-buffer bridge).
 */
import type { V1037PcresTurnInput, V1037PcresSupplyBridge } from '../types/core';
import { readV1037PcresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresInlandHeat20bzBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresSupplyBridge {
  return readV1037PcresInlandHeat20bzBridge(input.informationIntegrityResilience20ci, custodyChainStressExposureIndex);
}

export function applyV1037PcresInlandHeat20bzOverrides<T extends { bottleneckPressure?: number }>(
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
