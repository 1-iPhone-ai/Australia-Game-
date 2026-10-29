import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashEnrichMapLinkStress } from './link-stress.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashLinkStressDispersion {
  linkCount: number;
  meanStress: number;
  stdDev: number;
  hottestLinkId: string | null;
}

/** Dispersion of enriched map link stress levels (corridor + dependency). */
export function nrDashBuildLinkStressDispersion(ns: NationalSystemsState | null): NrDashLinkStressDispersion | null {
  if (!ns) return null;
  const links = nrDashEnrichMapLinkStress(
    nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    ),
    ns
  );
  const stresses = links.map(l => l.stressLevel ?? 0).filter(s => Number.isFinite(s));
  if (!stresses.length) return null;
  const meanStress = stresses.reduce((s, n) => s + n, 0) / stresses.length;
  const variance =
    stresses.reduce((s, n) => s + (n - meanStress) ** 2, 0) / Math.max(stresses.length, 1);
  const ranked = [...links].sort((a, b) => (b.stressLevel ?? 0) - (a.stressLevel ?? 0));
  return {
    linkCount: stresses.length,
    meanStress: Math.round(meanStress * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    hottestLinkId: ranked[0]?.id ?? null,
  };
}
