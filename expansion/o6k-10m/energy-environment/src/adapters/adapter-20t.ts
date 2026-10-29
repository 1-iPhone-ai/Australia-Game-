import type { V1014EnergyDepthRegionalSlice, V1014EnergyDepthRegionId } from '../types';
import { V1014_ENERGY_DEPTH_clamp } from '../primitives';

/** Cross-wire SECTION 20T — bounded industry modifier deltas from depth slices. */
export function V1014_ENERGY_DEPTH_adaptIndustriesModifiers(
  regions: Record<V1014EnergyDepthRegionId, V1014EnergyDepthRegionalSlice>,
): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const rid of Object.keys(regions) as V1014EnergyDepthRegionId[]) {
    const slice = regions[rid];
    out[rid] = {
      energy: slice.modifierEnergy,
      mining: slice.modifierMining,
      manufacturing: V1014_ENERGY_DEPTH_clamp(
        Math.floor((slice.modifierEnergy + slice.modifierMining) / 2),
        -18,
        12,
      ),
    };
  }
  return out;
}

export function V1014_ENERGY_DEPTH_mergeIndustryModifierDelta(
  existing: number | undefined,
  delta: number,
): number {
  return V1014_ENERGY_DEPTH_clamp((existing ?? 0) + delta, -18, 12);
}
