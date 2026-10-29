import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 149 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_149_META = {
  id: 'shock_149',
  regionId: 'TAS' as V1016NresRegionId,
  primarySystem: 'finance' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 130714,
} as const;

const V1016_NRES_SHOCK_SCENARIO_149_COEF = {
  k0: 30.5000,
  k1: 20.7000,
  k2: 10.9000,
  k3: 1.1000,
  k4: 90.4000,
  k5: 80.6000,
  k6: 70.8000,
  k7: 61.0000,
  k8: 51.2000,
  k9: 41.4000,
  k10: 31.6000,
  k11: 21.8000,
  k12: 12.0000,
  k13: 2.2000,
  k14: 91.5000,
  k15: 81.7000,
  k16: 71.9000,
  k17: 62.1000,
  k18: 52.3000,
  k19: 42.5000,
  k20: 32.7000,
  k21: 22.9000,
  k22: 13.1000,
  k23: 3.3000,
  k24: 92.6000,
  k25: 82.8000,
  k26: 73.0000,
  k27: 63.2000,
  k28: 53.4000,
  k29: 43.6000,
  k30: 33.8000,
  k31: 24.0000,
  k32: 14.2000,
  k33: 4.4000,
  k34: 93.7000,
  k35: 83.9000,
  k36: 74.1000,
  k37: 64.3000,
  k38: 54.5000,
  k39: 44.7000,
  k40: 34.9000,
  k41: 25.1000,
  k42: 15.3000,
  k43: 5.5000,
  k44: 94.8000,
  k45: 85.0000,
  k46: 75.2000,
  k47: 65.4000,
  k48: 55.6000,
  k49: 45.8000,
  k50: 36.0000,
  k51: 26.2000,
  k52: 16.4000,
  k53: 6.6000,
  k54: 95.9000,
  k55: 86.1000,
  k56: 76.3000,
  k57: 66.5000,
  k58: 56.7000,
  k59: 46.9000,
  k60: 37.1000,
  k61: 27.3000,
  k62: 17.5000,
  k63: 7.7000,
  k64: 97.0000,
  k65: 87.2000,
  k66: 77.4000,
  k67: 67.6000,
  k68: 57.8000,
  k69: 48.0000,
  k70: 38.2000,
  k71: 28.4000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_149_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_149_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_149_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_149_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_149_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_149_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_149_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_149_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_149_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_149_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_149_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_149_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
