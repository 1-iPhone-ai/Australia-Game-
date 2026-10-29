import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashHistoryActivityWeight } from './util.ts';
import type { NrDashAuthSnapshot, RegionMapNode } from '../types.ts';

/**
 * Merge layout constants with rows from an authoritative snapshot.
 * Missing regions in snap still appear with neutral defaults (layout-only).
 */
export function nrDashBuildRegionMapNodes(snap: NrDashAuthSnapshot | null): RegionMapNode[] {
  const byId = new Map((snap?.regions || []).map(r => [r.regionId, r]));
  return AGENT23_REGION_MAP_LAYOUT.map(layout => {
    const row = byId.get(layout.regionId);
    return {
      regionId: layout.regionId,
      name: layout.name,
      color: layout.color,
      x: layout.x,
      y: layout.y,
      owner: row?.owner ?? 'unknown',
      momentumBand: row?.momentumBand ?? '—',
      openNeeds: row?.openNeeds ?? 0,
      highRisks: row?.highRisks ?? 0,
      resilience: row?.resilience ?? null,
      activityWeight: nrDashHistoryActivityWeight(row?.momentumHistory ?? []),
    };
  });
}
