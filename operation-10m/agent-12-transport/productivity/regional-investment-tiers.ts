import type { TransportInvestmentTier } from '../types.ts';
import type { AuRegionCode, TransportAsset } from '../types.ts';

const TIERS: TransportInvestmentTier[] = ['emerging', 'regional', 'integrated', 'national_gateway'];

export function computeInvestmentTierByRegion(
  operationalAssets: TransportAsset[],
  portRailCoupling: Record<AuRegionCode, number>,
): Record<AuRegionCode, TransportInvestmentTier> {
  const out = {} as Record<AuRegionCode, TransportInvestmentTier>;
  const regions: AuRegionCode[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

  for (const code of regions) {
    const regional = operationalAssets.filter((a) => a.hostRegion === code);
    const points = regional.reduce((s, a) => s + a.baseProductivityPoints, 0);
    const categories = new Set(regional.map((a) => a.category)).size;
    const coupling = portRailCoupling[code] ?? 0;
    let score = points * 0.4 + categories * 8 + coupling * 0.25;

    if (code === 'NSW' || code === 'VIC' || code === 'QLD' || code === 'WA') score += 6;

    let tier: TransportInvestmentTier = 'emerging';
    if (score >= 62) tier = 'national_gateway';
    else if (score >= 45) tier = 'integrated';
    else if (score >= 28) tier = 'regional';
    out[code] = tier;
  }
  return out;
}

export function tierProductivityMultiplier(tier: TransportInvestmentTier): number {
  switch (tier) {
    case 'national_gateway':
      return 1.08;
    case 'integrated':
      return 1.05;
    case 'regional':
      return 1.02;
    default:
      return 1;
  }
}

export function isKnownTier(value: string): value is TransportInvestmentTier {
  return TIERS.includes(value as TransportInvestmentTier);
}
