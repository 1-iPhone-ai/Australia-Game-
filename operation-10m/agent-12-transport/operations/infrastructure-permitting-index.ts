import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PermittingStreamlinePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 infrastructure permitting velocity (higher = faster project approvals). */
export function computeInfrastructurePermittingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 36])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('permitting') || asset.tags.includes('planning') || asset.tags.includes('approval_hub')) {
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + asset.intermodalLinks.length * 1.6;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 380;
      }
    }
    if (asset.linkedProjectType && asset.baseProductivityPoints >= 5) {
      byRegion[asset.hostRegion] += 1.8;
    }
    if (asset.category === 'port' && asset.automationLevel >= 2) {
      byRegion[asset.hostRegion] += 1.2;
    }
  }

  const stressDrag = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stressDrag * 0.06), 18, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalInfrastructurePermittingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 86) * 10) / 10;
}

export function infrastructurePermittingProductivityMultiplier(
  permittingIndex: number,
  policy: PermittingStreamlinePolicy = 'baseline',
): number {
  const policyBoost = policy === 'fast_track' ? 0.046 : 0;
  const normalized = (permittingIndex - 44) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.1);
}
