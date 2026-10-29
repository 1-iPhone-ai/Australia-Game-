import {
  AU_REGION_CODES,
  type AuRegionCode,
  type ChannelMaintenancePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 channel maintenance readiness (dredging, pilotage, draft windows). */
export function computeChannelMaintenanceByRegion(
  operationalAssets: TransportAsset[],
  tradeUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 37])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      const channelScore =
        asset.maxDraftMetres * 2.4 + asset.berthCount * 1.7 + asset.automationLevel * 2.1;
      if (
        asset.tags.includes('dredging') ||
        asset.tags.includes('pilotage') ||
        asset.tags.includes('channel_depth')
      ) {
        byRegion[asset.hostRegion] += channelScore * 0.35;
      } else {
        byRegion[asset.hostRegion] += channelScore * 0.12;
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('pilotage')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 100_000 + 2;
    }
  }

  const utilDrag = clamp(tradeUtilization, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.02 - utilDrag * 0.06), 18, 93) * 10) / 10;
  }
  return byRegion;
}

export function nationalChannelMaintenanceIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 88) * 10) / 10;
}

export function channelMaintenanceProductivityMultiplier(
  maintenanceIndex: number,
  policy: ChannelMaintenancePolicy = 'baseline',
): number {
  const policyBoost = policy === 'dredge' ? 0.045 : 0;
  const normalized = (maintenanceIndex - 43) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.1);
}
