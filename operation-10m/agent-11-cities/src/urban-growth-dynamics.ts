import {
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_RegionId,
  type OP10M_A11_RegionSlice,
} from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

const MOMENTUM_BOOST: Record<string, number> = {
  declining: -10,
  weakening: -4,
  stable: 0,
  growing: 6,
  rapid_growth: 12,
  booming: 18,
};

const DEV_BOOST: Record<string, number> = {
  underdeveloped: -6,
  emerging: -1,
  developing: 3,
  advanced: 8,
  highly_developed: 12,
};

export function op10mA11AggregateUrbanGrowthByRegion(
  cities: OP10M_A11_CityGrowthSlice[],
): Record<OP10M_A11_RegionId, { avgGrowth: number; maxGrowth: number; cityCount: number; gatewayAvg: number }> {
  const acc: Partial<
    Record<
      OP10M_A11_RegionId,
      { sum: number; max: number; n: number; gatewaySum: number; gatewayN: number }
    >
  > = {};

  for (const c of cities) {
    const rid = c.regionId as OP10M_A11_RegionId;
    if (!OP10M_A11_CORE_REGIONS.includes(rid)) continue;
    const row = acc[rid] || { sum: 0, max: 0, n: 0, gatewaySum: 0, gatewayN: 0 };
    row.sum += c.growthScore;
    row.max = Math.max(row.max, c.growthScore);
    row.n += 1;
    if (c.gateway) {
      row.gatewaySum += c.growthScore;
      row.gatewayN += 1;
    }
    acc[rid] = row;
  }

  const out = {} as Record<
    OP10M_A11_RegionId,
    { avgGrowth: number; maxGrowth: number; cityCount: number; gatewayAvg: number }
  >;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const row = acc[rid];
    if (!row || !row.n) {
      out[rid] = { avgGrowth: 40, maxGrowth: 40, cityCount: 0, gatewayAvg: 40 };
      continue;
    }
    out[rid] = {
      avgGrowth: op10mA11Round(row.sum / row.n),
      maxGrowth: op10mA11Round(row.max),
      cityCount: row.n,
      gatewayAvg: op10mA11Round(row.gatewayN ? row.gatewaySum / row.gatewayN : row.sum / row.n),
    };
  }
  return out;
}

export function op10mA11BlendRegionalUrbanScore(
  urban: { avgGrowth: number; gatewayAvg: number },
  region: OP10M_A11_RegionSlice | undefined,
): number {
  const mom = MOMENTUM_BOOST[region?.momentumBand || 'stable'] ?? 0;
  const dev = DEV_BOOST[region?.developmentTier || 'emerging'] ?? 0;
  const infra = region?.infrastructureQuality ?? 45;
  const econ = region?.economyScore ?? 50;
  const base = urban.avgGrowth * 0.55 + urban.gatewayAvg * 0.2 + econ * 0.15;
  return op10mA11Clamp(base + mom + dev + (infra - 50) * 0.12);
}

export function op10mA11MetroRegionalGap(
  byRegion: Record<OP10M_A11_RegionId, { avgGrowth: number; gatewayAvg: number }>,
): number {
  const gatewayScores = OP10M_A11_CORE_REGIONS.map((r) => byRegion[r].gatewayAvg);
  const regionalScores = OP10M_A11_CORE_REGIONS.map((r) => byRegion[r].avgGrowth);
  const gMean = gatewayScores.reduce((a, b) => a + b, 0) / gatewayScores.length;
  const rMean = regionalScores.reduce((a, b) => a + b, 0) / regionalScores.length;
  return op10mA11Clamp(Math.abs(gMean - rMean) * 1.1);
}
