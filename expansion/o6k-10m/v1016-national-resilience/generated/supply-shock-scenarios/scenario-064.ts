import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 064 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_064_META = {
  id: 'shock_064',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'trade' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 56169,
} as const;

const V1016_NRES_SHOCK_SCENARIO_064_COEF = {
  k0: 74.7000,
  k1: 42.9000,
  k2: 11.1000,
  k3: 78.4000,
  k4: 46.6000,
  k5: 14.8000,
  k6: 82.1000,
  k7: 50.3000,
  k8: 18.5000,
  k9: 85.8000,
  k10: 54.0000,
  k11: 22.2000,
  k12: 89.5000,
  k13: 57.7000,
  k14: 25.9000,
  k15: 93.2000,
  k16: 61.4000,
  k17: 29.6000,
  k18: 96.9000,
  k19: 65.1000,
  k20: 33.3000,
  k21: 1.5000,
  k22: 68.8000,
  k23: 37.0000,
  k24: 5.2000,
  k25: 72.5000,
  k26: 40.7000,
  k27: 8.9000,
  k28: 76.2000,
  k29: 44.4000,
  k30: 12.6000,
  k31: 79.9000,
  k32: 48.1000,
  k33: 16.3000,
  k34: 83.6000,
  k35: 51.8000,
  k36: 20.0000,
  k37: 87.3000,
  k38: 55.5000,
  k39: 23.7000,
  k40: 91.0000,
  k41: 59.2000,
  k42: 27.4000,
  k43: 94.7000,
  k44: 62.9000,
  k45: 31.1000,
  k46: 98.4000,
  k47: 66.6000,
  k48: 34.8000,
  k49: 3.0000,
  k50: 70.3000,
  k51: 38.5000,
  k52: 6.7000,
  k53: 74.0000,
  k54: 42.2000,
  k55: 10.4000,
  k56: 77.7000,
  k57: 45.9000,
  k58: 14.1000,
  k59: 81.4000,
  k60: 49.6000,
  k61: 17.8000,
  k62: 85.1000,
  k63: 53.3000,
  k64: 21.5000,
  k65: 88.8000,
  k66: 57.0000,
  k67: 25.2000,
  k68: 92.5000,
  k69: 60.7000,
  k70: 28.9000,
  k71: 96.2000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_064_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_064_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_064_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_064_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_064_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_064_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_064_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_064_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_064_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_064_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_064_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_064_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
