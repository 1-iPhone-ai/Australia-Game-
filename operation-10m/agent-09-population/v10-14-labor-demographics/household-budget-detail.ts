import { v1014laborClamp } from './bands';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalHouseholdBudgetDetail,
  type RegionalHouseholdBudgetDetail
} from './types';

const AFFORDABILITY_RANK: Record<string, number> = {
  severe_pressure: 12,
  strained: 28,
  tight: 45,
  healthy: 68,
  very_affordable: 88
};

const RESILIENCE_RANK: Record<string, number> = {
  vulnerable: 15,
  fragile: 32,
  moderate: 52,
  resilient: 72,
  robust: 90
};

const ESSENTIALS_RANK: Record<string, number> = {
  critical: 10,
  poor: 25,
  strained: 42,
  adequate: 62,
  strong: 85
};

const HOUSING_PRESSURE_RANK: Record<string, number> = {
  severe: 8,
  high: 22,
  elevated: 38,
  moderate: 55,
  low: 78
};

function rank(map: Record<string, number>, band: unknown, fallback = 50): number {
  const key = String(band ?? '');
  return map[key] ?? fallback;
}

export function computeRegionalHouseholdBudgetDetail(
  regionId: string,
  households: any
): RegionalHouseholdBudgetDetail {
  const reg = households?.regions?.[regionId];
  if (!reg) {
    return {
      regionId,
      budgetPressureScore: 50,
      essentialsGapScore: 50,
      resilienceScore: 50,
      affordabilityBand: 'unknown',
      essentialsBand: 'unknown',
      narrative: 'Household budget detail unavailable — using neutral pressure.'
    };
  }

  const affordabilityBand = String(reg.affordability ?? households?.national?.affordability ?? 'tight');
  const essentialsBand = String(reg.essentialAccess ?? 'adequate');
  const resilienceBand = String(reg.resilience ?? reg.financialResilience ?? 'moderate');
  const housingBand = String(reg.housingPressure ?? households?.national?.housingPressure ?? 'moderate');

  const affordabilityScore = rank(AFFORDABILITY_RANK, affordabilityBand);
  const essentialsScore = rank(ESSENTIALS_RANK, essentialsBand);
  const resilienceScore = rank(RESILIENCE_RANK, resilienceBand);
  const housingScore = rank(HOUSING_PRESSURE_RANK, housingBand);

  const budgetPressureScore = v1014laborClamp(
    100 - affordabilityScore * 0.45 - resilienceScore * 0.25 - housingScore * 0.3
  );
  const essentialsGapScore = v1014laborClamp(100 - essentialsScore);

  const narrative =
    budgetPressureScore >= 65
      ? `Elevated household budget pressure (${affordabilityBand.replace(/_/g, ' ')}) weighs on labor mobility.`
      : budgetPressureScore <= 35
        ? `Household budgets are relatively resilient (${affordabilityBand.replace(/_/g, ' ')}).`
        : `Mixed household budget conditions (${affordabilityBand.replace(/_/g, ' ')}).`;

  return {
    regionId,
    budgetPressureScore,
    essentialsGapScore,
    resilienceScore,
    affordabilityBand,
    essentialsBand,
    narrative
  };
}

export function computeNationalHouseholdBudgetDetail(households: any): NationalHouseholdBudgetDetail {
  const regions: Record<string, RegionalHouseholdBudgetDetail> = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = computeRegionalHouseholdBudgetDetail(c, households);
  });

  const nationalBudgetPressureScore = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].budgetPressureScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalEssentialsGapScore = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].essentialsGapScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );

  const natAff = rank(AFFORDABILITY_RANK, households?.national?.affordability, 50);
  const natRes = rank(RESILIENCE_RANK, households?.national?.financialResilience, 50);
  let shockSensitivity: NationalHouseholdBudgetDetail['shockSensitivity'] = 'moderate';
  if (natRes <= 20 || (natRes <= 35 && natAff <= 25)) shockSensitivity = 'critical';
  else if (natRes <= 35 || natAff <= 30) shockSensitivity = 'high';
  else if (natRes >= 70 && natAff >= 65) shockSensitivity = 'low';

  const summary = `National household budget pressure index ${Math.round(nationalBudgetPressureScore)} (essentials gap ${Math.round(nationalEssentialsGapScore)}); shock sensitivity ${shockSensitivity}.`;

  return {
    nationalBudgetPressureScore,
    nationalEssentialsGapScore,
    shockSensitivity,
    regions,
    summary
  };
}

/** Bounded labor-market adjustments from household budget detail (no currency). */
export function householdBudgetLaborAdjustments(detail: RegionalHouseholdBudgetDetail): {
  attractivenessDelta: number;
  wagePressureDelta: number;
  employmentFitDelta: number;
} {
  const attractivenessDelta = -v1014laborClamp(detail.budgetPressureScore * 0.12, 0, 12);
  const wagePressureDelta = v1014laborClamp(detail.budgetPressureScore * 0.06, 0, 8);
  const employmentFitDelta = -v1014laborClamp(detail.essentialsGapScore * 0.08, 0, 10);
  return { attractivenessDelta, wagePressureDelta, employmentFitDelta };
}
