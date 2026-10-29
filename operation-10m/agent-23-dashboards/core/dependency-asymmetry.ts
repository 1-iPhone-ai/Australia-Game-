import { COMM_REGION_CODES } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

const IMPORTANCE_WEIGHT: Record<string, number> = {
  moderate: 1,
  high: 1.25,
  critical: 1.5,
};

export interface NrDashDependencyAsymmetryRow {
  regionId: string;
  inboundWeight: number;
  outboundWeight: number;
  /** Positive = net consumer of interregional flows. */
  netImportWeight: number;
}

export interface NrDashDependencyAsymmetrySummary {
  rows: NrDashDependencyAsymmetryRow[];
  maxAbsNet: number;
}

/** Net dependency pull/push per region from NS dependency edges (no forecasting). */
export function nrDashBuildDependencyAsymmetry(ns: NationalSystemsState | null): NrDashDependencyAsymmetrySummary | null {
  if (!ns?.dependencies?.length) return null;
  const inbound = new Map<string, number>();
  const outbound = new Map<string, number>();
  COMM_REGION_CODES.forEach(code => {
    inbound.set(code, 0);
    outbound.set(code, 0);
  });
  ns.dependencies.forEach(dep => {
    const w = IMPORTANCE_WEIGHT[dep.importance] ?? 1;
    inbound.set(dep.consumerRegionId, (inbound.get(dep.consumerRegionId) ?? 0) + w);
    outbound.set(dep.providerRegionId, (outbound.get(dep.providerRegionId) ?? 0) + w);
  });
  const rows: NrDashDependencyAsymmetryRow[] = COMM_REGION_CODES.map(regionId => {
    const inboundWeight = Math.round((inbound.get(regionId) ?? 0) * 1000) / 1000;
    const outboundWeight = Math.round((outbound.get(regionId) ?? 0) * 1000) / 1000;
    return {
      regionId,
      inboundWeight,
      outboundWeight,
      netImportWeight: Math.round((inboundWeight - outboundWeight) * 1000) / 1000,
    };
  });
  rows.sort(
    (a, b) => Math.abs(b.netImportWeight) - Math.abs(a.netImportWeight) || a.regionId.localeCompare(b.regionId)
  );
  const maxAbsNet = Math.max(...rows.map(r => Math.abs(r.netImportWeight)), 0);
  return { rows, maxAbsNet };
}

export function nrDashTopDependencyAsymmetry(ns: NationalSystemsState | null, limit = 3): NrDashDependencyAsymmetryRow[] {
  return nrDashBuildDependencyAsymmetry(ns)?.rows.slice(0, limit) ?? [];
}
