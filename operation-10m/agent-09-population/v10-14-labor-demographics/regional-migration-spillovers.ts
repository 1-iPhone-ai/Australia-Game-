import { v1014laborClamp } from './bands';

/** Neighbor spillover weights for migration attractiveness (structural, not geographic simulation). */
const SPILLOVER_NEIGHBORS: Record<string, string[]> = {
  NSW: ['VIC', 'QLD', 'ACT'],
  VIC: ['NSW', 'SA', 'TAS'],
  QLD: ['NSW', 'NT'],
  WA: ['SA', 'NT'],
  SA: ['VIC', 'WA', 'NT'],
  TAS: ['VIC'],
  NT: ['QLD', 'WA', 'SA'],
  ACT: ['NSW']
};

export function applyRegionalMigrationSpillovers(
  attractiveness: Record<string, number>,
  strength = 0.12
): Record<string, number> {
  const out: Record<string, number> = { ...attractiveness };
  Object.entries(SPILLOVER_NEIGHBORS).forEach(([regionId, neighbors]) => {
    const base = attractiveness[regionId] ?? 50;
    const neighborAvg =
      neighbors.reduce((a, n) => a + (attractiveness[n] ?? 50), 0) / Math.max(1, neighbors.length);
    const diff = neighborAvg - base;
    out[regionId] = v1014laborClamp(base + diff * strength);
  });
  return out;
}

export function spilloverNeighborList(regionId: string): string[] {
  return SPILLOVER_NEIGHBORS[regionId] ?? [];
}
