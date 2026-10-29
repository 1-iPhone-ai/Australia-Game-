import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 027 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_027_META = {
  id: 'shock_027',
  regionId: 'WA' as V1016NresRegionId,
  primarySystem: 'industrial' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 23720,
} as const;

const V1016_NRES_SHOCK_SCENARIO_027_COEF = {
  k0: 54.3000,
  k1: 47.9000,
  k2: 41.5000,
  k3: 35.1000,
  k4: 28.7000,
  k5: 22.3000,
  k6: 15.9000,
  k7: 9.5000,
  k8: 3.1000,
  k9: 95.8000,
  k10: 89.4000,
  k11: 83.0000,
  k12: 76.6000,
  k13: 70.2000,
  k14: 63.8000,
  k15: 57.4000,
  k16: 51.0000,
  k17: 44.6000,
  k18: 38.2000,
  k19: 31.8000,
  k20: 25.4000,
  k21: 19.0000,
  k22: 12.6000,
  k23: 6.2000,
  k24: 98.9000,
  k25: 92.5000,
  k26: 86.1000,
  k27: 79.7000,
  k28: 73.3000,
  k29: 66.9000,
  k30: 60.5000,
  k31: 54.1000,
  k32: 47.7000,
  k33: 41.3000,
  k34: 34.9000,
  k35: 28.5000,
  k36: 22.1000,
  k37: 15.7000,
  k38: 9.3000,
  k39: 2.9000,
  k40: 95.6000,
  k41: 89.2000,
  k42: 82.8000,
  k43: 76.4000,
  k44: 70.0000,
  k45: 63.6000,
  k46: 57.2000,
  k47: 50.8000,
  k48: 44.4000,
  k49: 38.0000,
  k50: 31.6000,
  k51: 25.2000,
  k52: 18.8000,
  k53: 12.4000,
  k54: 6.0000,
  k55: 98.7000,
  k56: 92.3000,
  k57: 85.9000,
  k58: 79.5000,
  k59: 73.1000,
  k60: 66.7000,
  k61: 60.3000,
  k62: 53.9000,
  k63: 47.5000,
  k64: 41.1000,
  k65: 34.7000,
  k66: 28.3000,
  k67: 21.9000,
  k68: 15.5000,
  k69: 9.1000,
  k70: 2.7000,
  k71: 95.4000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_027_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_027_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_027_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_027_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_027_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_027_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_027_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_027_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_027_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_027_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_027_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_027_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
