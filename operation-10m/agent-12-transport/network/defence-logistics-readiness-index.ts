import { AU_REGION_CODES, type AuRegionCode, type DefenceMobilityPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 defence logistics readiness (strategic mobility, surge capacity). */
export function computeDefenceLogisticsReadinessByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const defenceTagged =
      asset.tags.some((t) => t === 'defence_logistics' || t === 'strategic_mobility' || t === 'military_freight') ||
      asset.linkedProjectType === 'remote_logistics_base';

    if (!defenceTagged) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 520;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_500_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.9 + asset.teuCapacityPerYear / 320_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000 + asset.lastMileCoveragePct / 130;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDefenceLogisticsReadinessIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 4, 88) * 10) / 10;
}

export function defenceLogisticsProductivityMultiplier(
  readinessIndex: number,
  policy: DefenceMobilityPolicy = 'baseline',
): number {
  const policyBoost = policy === 'mobilize' ? 0.044 : 0;
  const normalized = (readinessIndex - 10) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.93, 1.11);
}
