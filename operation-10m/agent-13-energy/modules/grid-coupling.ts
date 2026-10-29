/** Agent 13 — national/regional grid stress from V10.0 energy networks (read-only). */

export type V1014GridStressBand = 'stable' | 'strained' | 'bottlenecked' | 'critical';

export interface V1014RegionalGridStress {
  regionId: string;
  band: V1014GridStressBand;
  stressPoints: number;
  renewableCoupling: 'weak' | 'moderate' | 'strong';
  summary: string;
}

const BAND_FROM_CONDITION: Record<string, V1014GridStressBand> = {
  stable: 'stable',
  healthy: 'stable',
  normal: 'stable',
  strained: 'strained',
  bottlenecked: 'bottlenecked',
  critical: 'critical',
  degraded: 'strained',
};

const STRESS_POINTS: Record<V1014GridStressBand, number> = {
  stable: 0,
  strained: 6,
  bottlenecked: 12,
  critical: 18,
};

export function v1014GridStressBandFromCondition(condition: string | undefined | null): V1014GridStressBand {
  const key = String(condition || 'stable').toLowerCase();
  return BAND_FROM_CONDITION[key] || 'stable';
}

export function computeRegionalGridStress(
  regionId: string,
  nationalSystems: { regions?: Record<string, { networks?: { energy?: { condition?: string; utilization?: number } } }> } | null,
  renewableShareScore: number,
): V1014RegionalGridStress {
  const energyNet = nationalSystems?.regions?.[regionId]?.networks?.energy;
  const band = v1014GridStressBandFromCondition(energyNet?.condition);
  const util = Number(energyNet?.utilization);
  const utilBoost = Number.isFinite(util) && util > 0.85 ? 4 : util > 0.7 ? 2 : 0;
  const stressPoints = STRESS_POINTS[band] + utilBoost;
  const renewableCoupling: V1014RegionalGridStress['renewableCoupling'] =
    renewableShareScore >= 55 ? 'strong' : renewableShareScore >= 30 ? 'moderate' : 'weak';
  const summary = `Grid ${band} in ${regionId}${utilBoost ? ` (high utilization)` : ''}; renewable coupling ${renewableCoupling}.`;
  return { regionId, band, stressPoints, renewableCoupling, summary };
}

export function nationalGridStressIndex(regional: V1014RegionalGridStress[]): number {
  if (!regional.length) return 0;
  return regional.reduce((a, r) => a + r.stressPoints, 0) / regional.length;
}
