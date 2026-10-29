import { LOGISTICS_CATALOG } from './logistics-catalog.ts';
import { PORT_CATALOG } from './ports-catalog.ts';
import { RAIL_CATALOG } from './rail-catalog.ts';
import { ROAD_CATALOG } from './roads-catalog.ts';
import { SCALE_WAVE_ASSETS } from './scale-wave-assets.ts';
import type { TransportAsset } from '../types.ts';

export function getAgent12TransportCatalog(): TransportAsset[] {
  return [...ROAD_CATALOG, ...RAIL_CATALOG, ...PORT_CATALOG, ...LOGISTICS_CATALOG, ...SCALE_WAVE_ASSETS];
}

export function getDefaultOperationalAssetIds(): ReadonlySet<string> {
  return new Set(getAgent12TransportCatalog().map((a) => a.id));
}

export function getCatalogIntegrityReport(): {
  totalAssets: number;
  byCategory: Record<string, number>;
  duplicateIds: string[];
  invalidRegions: string[];
} {
  const assets = getAgent12TransportCatalog();
  const byCategory: Record<string, number> = {};
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const invalidRegions: string[] = [];
  const valid = new Set(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT']);

  for (const a of assets) {
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
    if (seen.has(a.id)) duplicateIds.push(a.id);
    seen.add(a.id);
    if (!valid.has(a.hostRegion)) invalidRegions.push(`${a.id}:host`);
    for (const r of a.servedRegions) {
      if (!valid.has(r)) invalidRegions.push(`${a.id}:served:${r}`);
    }
  }

  return {
    totalAssets: assets.length,
    byCategory,
    duplicateIds,
    invalidRegions,
  };
}
