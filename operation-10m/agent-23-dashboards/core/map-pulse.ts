import { nrDashClamp01 } from './util.ts';
import type { RegionMapNode } from '../types.ts';

export interface NrDashMapPulseRow {
  regionId: string;
  /** 0..1 composite pulse from snapshot node fields (not simulated). */
  intensity: number;
}

/** Pulse intensity blends momentum activity, open needs, and high risks on map nodes. */
export function nrDashBuildMapPulseRows(nodes: RegionMapNode[]): NrDashMapPulseRow[] {
  return nodes.map(n => {
    const needTerm = nrDashClamp01(n.openNeeds / 8);
    const riskTerm = nrDashClamp01(n.highRisks / 4);
    const intensity = nrDashClamp01(n.activityWeight * 0.55 + needTerm * 0.25 + riskTerm * 0.2);
    return { regionId: n.regionId, intensity };
  });
}

export function nrDashApplyMapPulse(nodes: RegionMapNode[]): RegionMapNode[] {
  const pulse = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  return nodes.map(n => ({ ...n, pulseIntensity: pulse.get(n.regionId) ?? 0 }));
}

export function nrDashHottestPulseRegion(nodes: RegionMapNode[]): string | null {
  const rows = nrDashBuildMapPulseRows(nodes);
  if (!rows.length) return null;
  const top = [...rows].sort((a, b) => b.intensity - a.intensity)[0];
  return top.intensity > 0 ? top.regionId : null;
}
