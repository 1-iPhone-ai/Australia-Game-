import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 003 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_003_META = {
  id: 'shock_003',
  regionId: 'WA' as V1016NresRegionId,
  primarySystem: 'digital' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 2672,
} as const;

const V1016_NRES_SHOCK_SCENARIO_003_COEF = {
  k0: 86.6000,
  k1: 56.5000,
  k2: 26.4000,
  k3: 95.4000,
  k4: 65.3000,
  k5: 35.2000,
  k6: 5.1000,
  k7: 74.1000,
  k8: 44.0000,
  k9: 13.9000,
  k10: 82.9000,
  k11: 52.8000,
  k12: 22.7000,
  k13: 91.7000,
  k14: 61.6000,
  k15: 31.5000,
  k16: 1.4000,
  k17: 70.4000,
  k18: 40.3000,
  k19: 10.2000,
  k20: 79.2000,
  k21: 49.1000,
  k22: 19.0000,
  k23: 88.0000,
  k24: 57.9000,
  k25: 27.8000,
  k26: 96.8000,
  k27: 66.7000,
  k28: 36.6000,
  k29: 6.5000,
  k30: 75.5000,
  k31: 45.4000,
  k32: 15.3000,
  k33: 84.3000,
  k34: 54.2000,
  k35: 24.1000,
  k36: 93.1000,
  k37: 63.0000,
  k38: 32.9000,
  k39: 2.8000,
  k40: 71.8000,
  k41: 41.7000,
  k42: 11.6000,
  k43: 80.6000,
  k44: 50.5000,
  k45: 20.4000,
  k46: 89.4000,
  k47: 59.3000,
  k48: 29.2000,
  k49: 98.2000,
  k50: 68.1000,
  k51: 38.0000,
  k52: 7.9000,
  k53: 76.9000,
  k54: 46.8000,
  k55: 16.7000,
  k56: 85.7000,
  k57: 55.6000,
  k58: 25.5000,
  k59: 94.5000,
  k60: 64.4000,
  k61: 34.3000,
  k62: 4.2000,
  k63: 73.2000,
  k64: 43.1000,
  k65: 13.0000,
  k66: 82.0000,
  k67: 51.9000,
  k68: 21.8000,
  k69: 90.8000,
  k70: 60.7000,
  k71: 30.6000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_003_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_003_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_003_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_003_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_003_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_003_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_003_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_003_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_003_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_003_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_003_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_003_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
