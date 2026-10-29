import type { NrDashRegionalRow } from '../types.ts';

export interface NrDashTrendDeltaRow {
  regionId: string;
  name: string;
  delta: number | null;
  last: number | null;
}

/** Last-minus-first delta from authoritative momentum.history (no forecasting). */
export function nrDashBuildTrendDeltas(rows: NrDashRegionalRow[]): NrDashTrendDeltaRow[] {
  return rows.map(r => {
    const pts = (r.momentumHistory || []).filter(v => Number.isFinite(v));
    if (pts.length < 2) {
      return { regionId: r.regionId, name: r.name, delta: null, last: pts[pts.length - 1] ?? null };
    }
    const first = pts[0];
    const last = pts[pts.length - 1];
    return {
      regionId: r.regionId,
      name: r.name,
      delta: Math.round((last - first) * 1000) / 1000,
      last,
    };
  });
}

export function nrDashTopTrendMovers(rows: NrDashRegionalRow[], limit = 3): NrDashTrendDeltaRow[] {
  return nrDashBuildTrendDeltas(rows)
    .filter(r => r.delta != null)
    .sort((a, b) => Math.abs(b.delta!) - Math.abs(a.delta!))
    .slice(0, limit);
}
