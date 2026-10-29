import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashEnrichMapLinkStress } from './link-stress.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashPeripheralCorridorGap {
  hubRegionId: string | null;
  hubMeanStress: number;
  peripheralMeanStress: number;
  gap: number;
  peripheralLinkCount: number;
}

/** Mean link stress on hub-touching corridors vs all other map links. */
export function nrDashBuildPeripheralCorridorGap(ns: NationalSystemsState | null): NrDashPeripheralCorridorGap | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const stressed = nrDashEnrichMapLinkStress(merged, ns);
  if (!stressed.length) return null;
  const hubLinks = stressed.filter(l => l.fromId === hubRegionId || l.toId === hubRegionId);
  const peripheralLinks = stressed.filter(l => l.fromId !== hubRegionId && l.toId !== hubRegionId);
  const meanOf = (links: typeof stressed) => {
    if (!links.length) return 0;
    return links.reduce((s, l) => s + (l.stressLevel ?? 0), 0) / links.length;
  };
  const hubMeanStress = Math.round(meanOf(hubLinks) * 1000) / 1000;
  const peripheralMeanStress = Math.round(meanOf(peripheralLinks) * 1000) / 1000;
  return {
    hubRegionId,
    hubMeanStress,
    peripheralMeanStress,
    gap: Math.round((hubMeanStress - peripheralMeanStress) * 1000) / 1000,
    peripheralLinkCount: peripheralLinks.length,
  };
}
