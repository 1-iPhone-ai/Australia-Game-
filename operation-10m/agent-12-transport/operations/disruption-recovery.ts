import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

export interface DisruptionRecoverySnapshot {
  /** 0–1 headroom absorbing bottleneck shocks without productivity collapse. */
  nationalRecoveryFactor: number;
  logisticsHubCount: number;
  coldChainHubCount: number;
}

export function computeDisruptionRecovery(
  operationalAssets: TransportAsset[],
  resilienceScoreByRegion: Record<AuRegionCode, number>,
  bottleneckCount: number,
): DisruptionRecoverySnapshot {
  let logisticsHubCount = 0;
  let coldChainHubCount = 0;
  for (const asset of operationalAssets) {
    if (asset.category !== 'logistics') continue;
    logisticsHubCount += 1;
    if ('coldChainCapable' in asset && asset.coldChainCapable) coldChainHubCount += 1;
  }

  const avgResilience =
    AU_REGION_CODES.reduce((s, c) => s + (resilienceScoreByRegion[c] ?? 0), 0) / AU_REGION_CODES.length;

  const hubBoost = Math.min(0.25, logisticsHubCount * 0.012 + coldChainHubCount * 0.008);
  const bottleneckPenalty = Math.min(0.35, bottleneckCount * 0.04);
  const nationalRecoveryFactor = clamp(0.35 + avgResilience * 0.4 + hubBoost - bottleneckPenalty, 0.15, 0.95);

  return { nationalRecoveryFactor, logisticsHubCount, coldChainHubCount };
}
