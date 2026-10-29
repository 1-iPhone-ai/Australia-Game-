import type { Op10mRegionId, Op10mSimulationSlice } from './types.ts';

export const OP10M_AU_REGIONS: Op10mRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function contagionFlagKey(region: string, theme: string): string {
  return `op10m_contagion_${region}_${theme}`;
}

export function getContagionLevel(sim: Op10mSimulationSlice, region: string, theme: string): number {
  const raw = sim.flags[contagionFlagKey(region, theme)];
  return typeof raw === 'number' ? raw : raw ? 1 : 0;
}


/** Simplified mainland adjacency for narrative contagion (not geographic precision). */
export const OP10M_REGION_NEIGHBORS: Record<Op10mRegionId, Op10mRegionId[]> = {
  NSW: ['VIC', 'QLD', 'SA', 'ACT'],
  VIC: ['NSW', 'SA', 'TAS'],
  QLD: ['NSW', 'NT', 'SA'],
  WA: ['SA', 'NT'],
  SA: ['NSW', 'VIC', 'QLD', 'WA', 'NT'],
  TAS: ['VIC'],
  NT: ['QLD', 'WA', 'SA'],
  ACT: ['NSW'],
};

export function listNeighborRegions(region: Op10mRegionId): Op10mRegionId[] {
  return OP10M_REGION_NEIGHBORS[region] ?? [];
}
