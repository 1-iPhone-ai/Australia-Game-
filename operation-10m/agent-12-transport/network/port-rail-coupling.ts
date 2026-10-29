import type { AuRegionCode, TransportAsset } from '../types.ts';

export function computePortRailCouplingByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const ports = new Map<AuRegionCode, number>();
  const rail = new Map<AuRegionCode, number>();

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      ports.set(asset.hostRegion, (ports.get(asset.hostRegion) ?? 0) + asset.baseProductivityPoints);
    }
    if (asset.category === 'rail') {
      rail.set(asset.hostRegion, (rail.get(asset.hostRegion) ?? 0) + asset.baseProductivityPoints * 0.85);
    }
  }

  const out = {} as Record<AuRegionCode, number>;
  const regions: AuRegionCode[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
  for (const code of regions) {
    const p = ports.get(code) ?? 0;
    const r = rail.get(code) ?? 0;
    if (p <= 0 || r <= 0) {
      out[code] = Math.round(Math.min(p, r) * 2);
      continue;
    }
    const balance = Math.min(p, r) / Math.max(p, r);
    out[code] = Math.round(Math.min(100, (p + r) * 2.2 * (0.65 + balance * 0.35)));
  }
  return out;
}

export function nationalPortRailCouplingIndex(coupling: Record<AuRegionCode, number>): number {
  const vals = Object.values(coupling);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
