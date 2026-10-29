/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1037PcresTurnInput, V1037PcresSupplyBridge } from '../types/core';
import { readV1037PcresSupply20bbBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresSupply20bbBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresSupplyBridge {
  return readV1037PcresSupply20bbBridge(input.supply20bb, custodyChainStressExposureIndex);
}

export function applyV1037PcresSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1037PcresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1037_PCRS_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
