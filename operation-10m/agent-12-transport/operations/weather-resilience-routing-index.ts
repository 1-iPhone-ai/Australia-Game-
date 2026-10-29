import {
  AU_REGION_CODES,
  type AuRegionCode,
  type WeatherResiliencePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 weather-resilience routing capacity (flood bypass, heat routing). */
export function computeWeatherResilienceRoutingByRegion(
  operationalAssets: TransportAsset[],
  climateStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 34])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('weather_resilience') ||
      asset.tags.includes('flood_bypass') ||
      asset.tags.includes('heat_routing')
    ) {
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 360 + asset.designSpeedKmh / 55;
      }
      if (asset.category === 'rail' && 'trackKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.trackKilometres / 280 + asset.dualTrackShare * 8;
      }
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 115_000 + 2.5;
      }
    }
    if (asset.category === 'port' && asset.tags.includes('weather_resilience')) {
      byRegion[asset.hostRegion] += asset.berthCount * 2.2 + asset.maxDraftMetres;
    }
  }

  const stress = clamp(climateStress, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.05), 16, 94) * 10) / 10;
  }
  return byRegion;
}

export function nationalWeatherResilienceRoutingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 20, 86) * 10) / 10;
}

export function weatherResilienceProductivityMultiplier(
  routingIndex: number,
  policy: WeatherResiliencePolicy = 'baseline',
): number {
  const policyBoost = policy === 'harden' ? 0.047 : 0;
  const normalized = (routingIndex - 40) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.92, 1.1);
}
