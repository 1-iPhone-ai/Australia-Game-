import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 099 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_099_META = {
  id: 'shock_099',
  regionId: 'WA' as V1016NresRegionId,
  primarySystem: 'finance' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 86864,
} as const;

const V1016_NRES_SHOCK_SCENARIO_099_COEF = {
  k0: 56.5000,
  k1: 22.1000,
  k2: 86.8000,
  k3: 52.4000,
  k4: 18.0000,
  k5: 82.7000,
  k6: 48.3000,
  k7: 13.9000,
  k8: 78.6000,
  k9: 44.2000,
  k10: 9.8000,
  k11: 74.5000,
  k12: 40.1000,
  k13: 5.7000,
  k14: 70.4000,
  k15: 36.0000,
  k16: 1.6000,
  k17: 66.3000,
  k18: 31.9000,
  k19: 96.6000,
  k20: 62.2000,
  k21: 27.8000,
  k22: 92.5000,
  k23: 58.1000,
  k24: 23.7000,
  k25: 88.4000,
  k26: 54.0000,
  k27: 19.6000,
  k28: 84.3000,
  k29: 49.9000,
  k30: 15.5000,
  k31: 80.2000,
  k32: 45.8000,
  k33: 11.4000,
  k34: 76.1000,
  k35: 41.7000,
  k36: 7.3000,
  k37: 72.0000,
  k38: 37.6000,
  k39: 3.2000,
  k40: 67.9000,
  k41: 33.5000,
  k42: 98.2000,
  k43: 63.8000,
  k44: 29.4000,
  k45: 94.1000,
  k46: 59.7000,
  k47: 25.3000,
  k48: 90.0000,
  k49: 55.6000,
  k50: 21.2000,
  k51: 85.9000,
  k52: 51.5000,
  k53: 17.1000,
  k54: 81.8000,
  k55: 47.4000,
  k56: 13.0000,
  k57: 77.7000,
  k58: 43.3000,
  k59: 8.9000,
  k60: 73.6000,
  k61: 39.2000,
  k62: 4.8000,
  k63: 69.5000,
  k64: 35.1000,
  k65: 0.7000,
  k66: 65.4000,
  k67: 31.0000,
  k68: 95.7000,
  k69: 61.3000,
  k70: 26.9000,
  k71: 91.6000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_099_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_099_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_099_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_099_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_099_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_099_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_099_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_099_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_099_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_099_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_099_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_099_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
