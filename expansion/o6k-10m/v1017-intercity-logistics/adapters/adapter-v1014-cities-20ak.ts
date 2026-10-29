/**
 * Cross-wire: V1014 cities intercity (SECTION 20AK).
 */
import type { V1017IclogCitiesBridge, V1017IclogTurnInput } from '../types/core';
import { readV1017IclogCities20akBridge } from './adapter-crosswire-hub';
import { V1017_ICLOG_clamp } from '../engine/intercity-logistics-utils';

export function computeV1017IclogCities20akBridge(
  input: V1017IclogTurnInput,
  severityIndex: number,
): V1017IclogCitiesBridge {
  return readV1017IclogCities20akBridge(input.cities20ak, severityIndex);
}

export function applyV1017IclogCities20akLinkOverrides<T extends { intercityLinkCongestion?: number }>(
  base: T,
  bridge: V1017IclogCitiesBridge,
): T {
  return {
    ...base,
    intercityLinkCongestion: V1017_ICLOG_clamp((base.intercityLinkCongestion ?? 55) - bridge.congestionDrag * 18, 0, 100),
  };
}
