import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';

/** Stylized productivity spillover when corridors serve multiple regions. */
const SPILLOVER: Partial<Record<AuRegionCode, Partial<Record<AuRegionCode, number>>>> = {
  NSW: { VIC: 0.12, QLD: 0.08, ACT: 0.15, SA: 0.05 },
  VIC: { NSW: 0.11, TAS: 0.14, SA: 0.09 },
  QLD: { NSW: 0.1, NT: 0.11 },
  WA: { SA: 0.13, NT: 0.06 },
  SA: { WA: 0.1, VIC: 0.08, NSW: 0.06 },
  TAS: { VIC: 0.18 },
  NT: { QLD: 0.09, WA: 0.07, SA: 0.05 },
  ACT: { NSW: 0.2 },
};

export function computeSpilloverBonusByRegion(
  operationalAssets: TransportAsset[],
  regionalProductivityBonus: Record<AuRegionCode, number>,
): Record<AuRegionCode, number> {
  const hostPoints = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) hostPoints[code] = 0;
  for (const asset of operationalAssets) {
    hostPoints[asset.hostRegion] += asset.baseProductivityPoints;
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    let bonus = 0;
    const edges = SPILLOVER[code];
    if (edges) {
      for (const [target, weight] of Object.entries(edges)) {
        const t = target as AuRegionCode;
        bonus += (regionalProductivityBonus[t] ?? 0) * weight * 0.08;
        bonus += hostPoints[t] * weight * 0.05;
      }
    }
    out[code] = Math.round(bonus * 100) / 100;
  }
  return out;
}
