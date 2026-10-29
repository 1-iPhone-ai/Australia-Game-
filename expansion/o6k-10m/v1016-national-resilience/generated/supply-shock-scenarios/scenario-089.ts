import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 089 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_089_META = {
  id: 'shock_089',
  regionId: 'VIC' as V1016NresRegionId,
  primarySystem: 'finance' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 78094,
} as const;

const V1016_NRES_SHOCK_SCENARIO_089_COEF = {
  k0: 61.7000,
  k1: 42.2000,
  k2: 22.7000,
  k3: 3.2000,
  k4: 82.8000,
  k5: 63.3000,
  k6: 43.8000,
  k7: 24.3000,
  k8: 4.8000,
  k9: 84.4000,
  k10: 64.9000,
  k11: 45.4000,
  k12: 25.9000,
  k13: 6.4000,
  k14: 86.0000,
  k15: 66.5000,
  k16: 47.0000,
  k17: 27.5000,
  k18: 8.0000,
  k19: 87.6000,
  k20: 68.1000,
  k21: 48.6000,
  k22: 29.1000,
  k23: 9.6000,
  k24: 89.2000,
  k25: 69.7000,
  k26: 50.2000,
  k27: 30.7000,
  k28: 11.2000,
  k29: 90.8000,
  k30: 71.3000,
  k31: 51.8000,
  k32: 32.3000,
  k33: 12.8000,
  k34: 92.4000,
  k35: 72.9000,
  k36: 53.4000,
  k37: 33.9000,
  k38: 14.4000,
  k39: 94.0000,
  k40: 74.5000,
  k41: 55.0000,
  k42: 35.5000,
  k43: 16.0000,
  k44: 95.6000,
  k45: 76.1000,
  k46: 56.6000,
  k47: 37.1000,
  k48: 17.6000,
  k49: 97.2000,
  k50: 77.7000,
  k51: 58.2000,
  k52: 38.7000,
  k53: 19.2000,
  k54: 98.8000,
  k55: 79.3000,
  k56: 59.8000,
  k57: 40.3000,
  k58: 20.8000,
  k59: 1.3000,
  k60: 80.9000,
  k61: 61.4000,
  k62: 41.9000,
  k63: 22.4000,
  k64: 2.9000,
  k65: 82.5000,
  k66: 63.0000,
  k67: 43.5000,
  k68: 24.0000,
  k69: 4.5000,
  k70: 84.1000,
  k71: 64.6000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_089_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_089_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_089_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_089_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_089_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_089_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_089_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_089_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_089_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_089_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_089_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_089_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
