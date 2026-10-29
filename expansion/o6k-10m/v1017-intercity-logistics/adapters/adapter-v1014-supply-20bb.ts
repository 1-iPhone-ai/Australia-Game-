/**
 * Cross-wire: V1014 supply chain depth (SECTION 20BB).
 */
import type { V1017IclogTurnInput, V1017IclogSupplyBridge } from '../types/core';
import { readV1017IclogSupply20bbBridge } from './adapter-crosswire-hub';
import { V1017_ICLOG_clamp } from '../engine/intercity-logistics-utils';

export function computeV1017IclogSupply20bbBridge(
  input: V1017IclogTurnInput,
  severityIndex: number,
): V1017IclogSupplyBridge {
  return readV1017IclogSupply20bbBridge(input.supply20bb, severityIndex);
}

export function applyV1017IclogSupply20bbBottleneckOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1017IclogSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1017_ICLOG_clamp((base.bottleneckPressure ?? 40) + bridge.bottleneckDelta, 0, 100),
  };
}
