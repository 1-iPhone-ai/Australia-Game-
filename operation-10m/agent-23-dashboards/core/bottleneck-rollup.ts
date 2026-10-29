import { NATIONAL_NETWORK_LABEL } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashBottleneckRow {
  id: string;
  regionId: string | null;
  network: string | null;
  severity: string | null;
  label: string;
}

export function nrDashBuildBottleneckRollup(ns: NationalSystemsState | null): NrDashBottleneckRow[] {
  if (!ns) return [];
  return ns.bottlenecks.map(b => ({
    id: b.id,
    regionId: b.regionId ?? null,
    network: b.network ? NATIONAL_NETWORK_LABEL[b.network] : null,
    severity: b.severity ?? null,
    label: [b.regionId, b.network, b.severity].filter(Boolean).join(' · ') || b.id,
  }));
}
