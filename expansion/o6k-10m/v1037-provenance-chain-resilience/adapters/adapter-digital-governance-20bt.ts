/**
 * Cross-wire: V1024 digital governance facility zone depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1037PcresTurnInput, V1037PcresSupplyBridge } from '../types/core';
import { readV1037PcresDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils';

export function computeV1037PcresDigitalGovernance20btBridge(
  input: V1037PcresTurnInput,
  custodyChainStressExposureIndex: number,
): V1037PcresSupplyBridge {
  return readV1037PcresDigitalGovernance20btBridge(input.digitalGovernance20bt, custodyChainStressExposureIndex);
}

export function applyV1037PcresDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1037PcresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1037_PCRS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
