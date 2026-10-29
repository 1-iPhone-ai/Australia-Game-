import { nrDashBuildCorridorStressRows } from './corridor-stress.ts';
import { nrDashBuildDependencyChokepoints } from './dependency-chokepoint.ts';
import { nrDashClamp01 } from './util.ts';
import type { NationalSystemsState, NrDashMapLink } from '../types.ts';

function corridorKeyForLink(link: NrDashMapLink): string | null {
  if (link.kind !== 'adjacency') return null;
  const [a, b] = [link.fromId, link.toId].sort();
  return `${a}-${b}`;
}

/** Attach 0..1 stress levels to map links from corridor means or dependency choke scores. */
export function nrDashEnrichMapLinkStress(links: NrDashMapLink[], ns: NationalSystemsState | null): NrDashMapLink[] {
  if (!links.length) return links;
  const corridorByKey = new Map(
    nrDashBuildCorridorStressRows(ns).map(r => [r.corridorKey, r.meanPeakUtilization])
  );
  const chokes = nrDashBuildDependencyChokepoints(ns);
  const maxChoke = chokes.reduce((m, c) => Math.max(m, c.chokeScore), 0.001);
  const chokeByDepId = new Map(chokes.map(c => [c.dependencyId, c.chokeScore]));

  return links.map(link => {
    if (link.kind === 'adjacency') {
      const key = corridorKeyForLink(link);
      const mean = key ? corridorByKey.get(key) ?? 0 : 0;
      const stressLevel = nrDashClamp01(mean);
      return {
        ...link,
        stressLevel,
        title: `${link.title} · corridor stress ${Math.round(stressLevel * 100)}%`,
      };
    }
    const depId = link.id.replace(/^dep_/, '');
    const choke = chokeByDepId.get(depId) ?? 0;
    const stressLevel = nrDashClamp01(choke / maxChoke);
    return {
      ...link,
      stressLevel,
      title: `${link.title} · dependency stress ${Math.round(stressLevel * 100)}%`,
    };
  });
}

export function nrDashHottestMapLinkStress(links: NrDashMapLink[]): NrDashMapLink | null {
  const ranked = [...links].filter(l => (l.stressLevel ?? 0) > 0).sort((a, b) => (b.stressLevel ?? 0) - (a.stressLevel ?? 0));
  return ranked[0] ?? null;
}
