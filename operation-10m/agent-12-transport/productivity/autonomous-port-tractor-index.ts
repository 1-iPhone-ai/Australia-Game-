import {
  AU_REGION_CODES,
  type AuRegionCode,
  type AutonomousPortTractorPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port yard moves using autonomous tractors. */
export function computeAutonomousPortTractorShare(
  operationalAssets: TransportAsset[],
  policy: AutonomousPortTractorPolicy = 'baseline',
): number {
  let autoUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'autonomous_tractor' || t === 'port_yard_robot' || t === 'terminal_automation',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 2.2 + asset.automationLevel * 1.4;
        autoUnits += (asset.berthCount * 2.2 + asset.automationLevel * 1.4) * (0.55 + asset.automationLevel * 0.08);
      }
      if (asset.category === 'logistics' && asset.intermodalLinks.includes('port')) {
        totalUnits += asset.warehouseSqm / 85_000;
        autoUnits += asset.warehouseSqm / 85_000 * 0.58;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'deploy' ? 0.034 : 0;
  return Math.round(clamp(autoUnits / totalUnits + policyBoost, 0.033, 0.36) * 1000) / 1000;
}

export function autonomousPortTractorProductivityMultiplier(
  share: number,
  policy: AutonomousPortTractorPolicy,
): number {
  const bias = policy === 'deploy' ? 1.023 : 1;
  return (1 + (share - 0.06) * 0.032) * bias;
}

export function computeAutonomousPortTractorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'autonomous_tractor' || t === 'port_yard_robot' || t === 'terminal_automation',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.5 + asset.teuCapacityPerYear / 270_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 80_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 480;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAutonomousPortTractorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 2, 55) * 10) / 10;
}
