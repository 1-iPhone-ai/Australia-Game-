import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 095 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_095_META = {
  id: 'shock_095',
  regionId: 'ACT' as V1016NresRegionId,
  primarySystem: 'pharma' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 83356,
} as const;

const V1016_NRES_SHOCK_SCENARIO_095_COEF = {
  k0: 78.4000,
  k1: 89.6000,
  k2: 1.7000,
  k3: 12.9000,
  k4: 24.1000,
  k5: 35.3000,
  k6: 46.5000,
  k7: 57.7000,
  k8: 68.9000,
  k9: 80.1000,
  k10: 91.3000,
  k11: 3.4000,
  k12: 14.6000,
  k13: 25.8000,
  k14: 37.0000,
  k15: 48.2000,
  k16: 59.4000,
  k17: 70.6000,
  k18: 81.8000,
  k19: 93.0000,
  k20: 5.1000,
  k21: 16.3000,
  k22: 27.5000,
  k23: 38.7000,
  k24: 49.9000,
  k25: 61.1000,
  k26: 72.3000,
  k27: 83.5000,
  k28: 94.7000,
  k29: 6.8000,
  k30: 18.0000,
  k31: 29.2000,
  k32: 40.4000,
  k33: 51.6000,
  k34: 62.8000,
  k35: 74.0000,
  k36: 85.2000,
  k37: 96.4000,
  k38: 8.5000,
  k39: 19.7000,
  k40: 30.9000,
  k41: 42.1000,
  k42: 53.3000,
  k43: 64.5000,
  k44: 75.7000,
  k45: 86.9000,
  k46: 98.1000,
  k47: 10.2000,
  k48: 21.4000,
  k49: 32.6000,
  k50: 43.8000,
  k51: 55.0000,
  k52: 66.2000,
  k53: 77.4000,
  k54: 88.6000,
  k55: 0.7000,
  k56: 11.9000,
  k57: 23.1000,
  k58: 34.3000,
  k59: 45.5000,
  k60: 56.7000,
  k61: 67.9000,
  k62: 79.1000,
  k63: 90.3000,
  k64: 2.4000,
  k65: 13.6000,
  k66: 24.8000,
  k67: 36.0000,
  k68: 47.2000,
  k69: 58.4000,
  k70: 69.6000,
  k71: 80.8000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_095_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_095_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_095_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_095_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_095_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_095_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_095_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_095_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_095_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_095_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_095_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_095_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
