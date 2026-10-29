import { AU_REGION_CODES, type AuRegionCode } from '../types.ts';
import { clamp } from './formulas.ts';

export interface SupplyChainResilienceSnapshot {
  nationalIndex: number;
  weakestRegion: AuRegionCode;
  byRegion: Record<AuRegionCode, number>;
}

export function computeSupplyChainResilienceIndex(params: {
  resilienceScoreByRegion: Record<AuRegionCode, number>;
  freightLatencyByRegion: Record<AuRegionCode, number>;
  recoveryFactor: number;
  corridorSynergyPoints: number;
}): SupplyChainResilienceSnapshot {
  const byRegion = {} as Record<AuRegionCode, number>;
  let weakestRegion: AuRegionCode = 'NT';
  let weakestScore = Number.POSITIVE_INFINITY;

  for (const code of AU_REGION_CODES) {
    const latencyPenalty = Math.min(0.35, (params.freightLatencyByRegion[code] ?? 20) / 60);
    const raw =
      (params.resilienceScoreByRegion[code] ?? 0) * 0.55 +
      params.recoveryFactor * 0.25 +
      Math.min(0.2, params.corridorSynergyPoints / 120) -
      latencyPenalty;
    byRegion[code] = Math.round(clamp(raw, 0.05, 1) * 1000) / 1000;
    if (byRegion[code] < weakestScore) {
      weakestScore = byRegion[code];
      weakestRegion = code;
    }
  }

  const nationalIndex =
    Math.round(
      (AU_REGION_CODES.reduce((s, c) => s + byRegion[c], 0) / AU_REGION_CODES.length) * 1000,
    ) / 1000;

  return { nationalIndex, weakestRegion, byRegion };
}
