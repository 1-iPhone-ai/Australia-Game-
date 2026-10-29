import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 134 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_134_META = {
  id: 'shock_134',
  regionId: 'NT' as V1016NresRegionId,
  primarySystem: 'trade' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 117559,
} as const;

const V1016_NRES_SHOCK_SCENARIO_134_COEF = {
  k0: 38.3000,
  k1: 1.3000,
  k2: 63.4000,
  k3: 26.4000,
  k4: 88.5000,
  k5: 51.5000,
  k6: 14.5000,
  k7: 76.6000,
  k8: 39.6000,
  k9: 2.6000,
  k10: 64.7000,
  k11: 27.7000,
  k12: 89.8000,
  k13: 52.8000,
  k14: 15.8000,
  k15: 77.9000,
  k16: 40.9000,
  k17: 3.9000,
  k18: 66.0000,
  k19: 29.0000,
  k20: 91.1000,
  k21: 54.1000,
  k22: 17.1000,
  k23: 79.2000,
  k24: 42.2000,
  k25: 5.2000,
  k26: 67.3000,
  k27: 30.3000,
  k28: 92.4000,
  k29: 55.4000,
  k30: 18.4000,
  k31: 80.5000,
  k32: 43.5000,
  k33: 6.5000,
  k34: 68.6000,
  k35: 31.6000,
  k36: 93.7000,
  k37: 56.7000,
  k38: 19.7000,
  k39: 81.8000,
  k40: 44.8000,
  k41: 7.8000,
  k42: 69.9000,
  k43: 32.9000,
  k44: 95.0000,
  k45: 58.0000,
  k46: 21.0000,
  k47: 83.1000,
  k48: 46.1000,
  k49: 9.1000,
  k50: 71.2000,
  k51: 34.2000,
  k52: 96.3000,
  k53: 59.3000,
  k54: 22.3000,
  k55: 84.4000,
  k56: 47.4000,
  k57: 10.4000,
  k58: 72.5000,
  k59: 35.5000,
  k60: 97.6000,
  k61: 60.6000,
  k62: 23.6000,
  k63: 85.7000,
  k64: 48.7000,
  k65: 11.7000,
  k66: 73.8000,
  k67: 36.8000,
  k68: 98.9000,
  k69: 61.9000,
  k70: 24.9000,
  k71: 87.0000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_134_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_134_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_134_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_134_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_134_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_134_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_134_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_134_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_134_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_134_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_134_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_134_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
