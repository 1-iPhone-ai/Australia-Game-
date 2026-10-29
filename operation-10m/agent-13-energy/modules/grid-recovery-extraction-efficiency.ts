/**
 * Agent 13 — slice 2: grid recovery pathways & regional extraction efficiency (read-only modifiers).
 */

import type { V1014GridStressBand } from './grid-coupling';

export type V1014GridRecoveryBand = 'stalled' | 'gradual' | 'accelerating';

export interface V1014RegionalGridRecovery {
  regionId: string;
  band: V1014GridRecoveryBand;
  recoveryPoints: number;
  pressureRelief: number;
  summary: string;
}

export type V1014ExtractionEfficiencyBand = 'poor' | 'fair' | 'good' | 'leading';

export interface V1014RegionalExtractionEfficiency {
  regionId: string;
  score: number;
  band: V1014ExtractionEfficiencyBand;
  miningModifierBoost: number;
  summary: string;
}

const GRID_RECOVERY_PROJECT_BOOST: Record<string, number> = {
  renewable_grid: 6,
  battery_grid: 5,
  offshore_wind_farm: 4,
  pumped_hydro: 5,
  green_hydrogen_hub: 3,
  solar_farm: 2,
};

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

function bandRecovery(points: number): V1014GridRecoveryBand {
  if (points >= 14) return 'accelerating';
  if (points >= 6) return 'gradual';
  return 'stalled';
}

function bandEfficiency(score: number): V1014ExtractionEfficiencyBand {
  if (score >= 72) return 'leading';
  if (score >= 52) return 'good';
  if (score >= 34) return 'fair';
  return 'poor';
}

export function computeRegionalGridRecovery(params: {
  regionId: string;
  gridStressBand: V1014GridStressBand;
  gridStressPoints: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
}): V1014RegionalGridRecovery {
  const { regionId, gridStressBand, gridStressPoints, renewableShareScore, completedProjectTypes } = params;
  if (gridStressPoints <= 0 || gridStressBand === 'stable') {
    return {
      regionId,
      band: 'accelerating',
      recoveryPoints: 0,
      pressureRelief: 0,
      summary: `Grid stable in ${regionId}; no recovery intervention required.`,
    };
  }

  let recoveryPoints = clamp(renewableShareScore / 12, 0, 8);
  if (renewableShareScore >= 55) recoveryPoints += 4;
  for (const pt of completedProjectTypes) {
    recoveryPoints += GRID_RECOVERY_PROJECT_BOOST[pt] || 0;
  }
  if (gridStressBand === 'critical') recoveryPoints *= 0.75;
  recoveryPoints = clamp(recoveryPoints, 0, 20);

  const band = bandRecovery(recoveryPoints);
  const pressureRelief = clamp(recoveryPoints * 0.65 + (band === 'accelerating' ? 2 : 0), 0, 14);
  const summary = `Grid recovery ${band} in ${regionId} (${recoveryPoints.toFixed(1)} pts) offsets ${pressureRelief.toFixed(1)} environmental pressure.`;

  return { regionId, band, recoveryPoints, pressureRelief, summary };
}

export interface V1014ExtractionSiteEfficiencySample {
  environmentalRisk: 'low' | 'moderate' | 'high';
  waterIntensity: number;
  emissionsIntensity: number;
  requiresPermit: boolean;
  rehabilitationYears: number;
}

export function computeRegionalExtractionEfficiency(params: {
  regionId: string;
  sites: V1014ExtractionSiteEfficiencySample[];
  renewableShareScore: number;
}): V1014RegionalExtractionEfficiency {
  const { regionId, sites, renewableShareScore } = params;
  if (!sites.length) {
    return {
      regionId,
      score: 50,
      band: 'fair',
      miningModifierBoost: 0,
      summary: `No registered extraction sites in ${regionId}; neutral efficiency assumed.`,
    };
  }

  const avgWater = sites.reduce((a, s) => a + s.waterIntensity, 0) / sites.length;
  const avgEmissions = sites.reduce((a, s) => a + s.emissionsIntensity, 0) / sites.length;
  const highRiskShare = sites.filter(s => s.environmentalRisk === 'high').length / sites.length;
  const permitShare = sites.filter(s => s.requiresPermit).length / sites.length;
  const rehabAvg = sites.reduce((a, s) => a + s.rehabilitationYears, 0) / sites.length;

  let score = 62;
  score -= avgWater * 18;
  score -= avgEmissions * 22;
  score -= highRiskShare * 16;
  score -= Math.max(0, rehabAvg - 5) * 2;
  score += permitShare * 4;
  score += clamp(renewableShareScore / 8, 0, 10);

  score = clamp(score, 0, 100);
  const band = bandEfficiency(score);
  const miningModifierBoost =
    band === 'leading' ? 3 : band === 'good' ? 1.5 : band === 'fair' ? 0 : -2;

  const summary = `Extraction efficiency ${band} in ${regionId} (score ${score.toFixed(0)}); bounded mining modifier ${miningModifierBoost >= 0 ? '+' : ''}${miningModifierBoost.toFixed(1)}.`;

  return { regionId, score, band, miningModifierBoost, summary };
}

export function nationalGridRecoveryIndex(recoveries: V1014RegionalGridRecovery[]): number {
  if (!recoveries.length) return 0;
  return recoveries.reduce((a, r) => a + r.recoveryPoints, 0) / recoveries.length;
}
