import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 119 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_119_META = {
  id: 'shock_119',
  regionId: 'ACT' as V1016NresRegionId,
  primarySystem: 'finance' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 104404,
} as const;

const V1016_NRES_SHOCK_SCENARIO_119_COEF = {
  k0: 46.1000,
  k1: 81.0000,
  k2: 16.8000,
  k3: 51.7000,
  k4: 86.6000,
  k5: 22.4000,
  k6: 57.3000,
  k7: 92.2000,
  k8: 28.0000,
  k9: 62.9000,
  k10: 97.8000,
  k11: 33.6000,
  k12: 68.5000,
  k13: 4.3000,
  k14: 39.2000,
  k15: 74.1000,
  k16: 9.9000,
  k17: 44.8000,
  k18: 79.7000,
  k19: 15.5000,
  k20: 50.4000,
  k21: 85.3000,
  k22: 21.1000,
  k23: 56.0000,
  k24: 90.9000,
  k25: 26.7000,
  k26: 61.6000,
  k27: 96.5000,
  k28: 32.3000,
  k29: 67.2000,
  k30: 3.0000,
  k31: 37.9000,
  k32: 72.8000,
  k33: 8.6000,
  k34: 43.5000,
  k35: 78.4000,
  k36: 14.2000,
  k37: 49.1000,
  k38: 84.0000,
  k39: 19.8000,
  k40: 54.7000,
  k41: 89.6000,
  k42: 25.4000,
  k43: 60.3000,
  k44: 95.2000,
  k45: 31.0000,
  k46: 65.9000,
  k47: 1.7000,
  k48: 36.6000,
  k49: 71.5000,
  k50: 7.3000,
  k51: 42.2000,
  k52: 77.1000,
  k53: 12.9000,
  k54: 47.8000,
  k55: 82.7000,
  k56: 18.5000,
  k57: 53.4000,
  k58: 88.3000,
  k59: 24.1000,
  k60: 59.0000,
  k61: 93.9000,
  k62: 29.7000,
  k63: 64.6000,
  k64: 0.4000,
  k65: 35.3000,
  k66: 70.2000,
  k67: 6.0000,
  k68: 40.9000,
  k69: 75.8000,
  k70: 11.6000,
  k71: 46.5000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_119_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_119_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_119_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_119_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_119_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_119_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_119_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_119_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_119_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_119_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_119_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_119_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
