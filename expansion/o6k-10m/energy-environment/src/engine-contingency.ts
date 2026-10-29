import type { V1014EnergyDepthRegionId } from './types';
import { V1014_ENERGY_DEPTH_clamp } from './primitives';
import { V1014_ENERGY_DEPTH_CONTINGENCY_SCENARIOS } from './catalog/contingency-scenarios';

export function V1014_ENERGY_DEPTH_contingenciesForRegion(
  regionId: V1014EnergyDepthRegionId,
): typeof V1014_ENERGY_DEPTH_CONTINGENCY_SCENARIOS {
  return V1014_ENERGY_DEPTH_CONTINGENCY_SCENARIOS.filter(c => c.regionId === regionId);
}

export function V1014_ENERGY_DEPTH_applyContingencyOverlay(
  regionId: V1014EnergyDepthRegionId,
  reserveMarginPct: number,
  triggerSubstring: string,
): number {
  const matches = V1014_ENERGY_DEPTH_contingenciesForRegion(regionId).filter(c =>
    c.trigger.includes(triggerSubstring.slice(0, 4)),
  );
  if (matches.length === 0) return reserveMarginPct;
  const avgDelta = matches.reduce((s, m) => s + m.reserveDeltaPct, 0) / matches.length;
  return reserveMarginPct + avgDelta;
}

export function V1014_ENERGY_DEPTH_worstContingencySeverity(
  regionId: V1014EnergyDepthRegionId,
): number {
  const list = V1014_ENERGY_DEPTH_contingenciesForRegion(regionId);
  return list.reduce((m, c) => Math.max(m, c.severity), 0);
}

export function V1014_ENERGY_DEPTH_intermittencyMultiplierFromContingency(
  regionId: V1014EnergyDepthRegionId,
  hourBucket: number,
): number {
  const list = V1014_ENERGY_DEPTH_contingenciesForRegion(regionId);
  const pick = list[(hourBucket + list.length) % Math.max(list.length, 1)];
  return pick ? V1014_ENERGY_DEPTH_clamp(pick.intermittencyMultiplier, 1, 2.5) : 1;
}
