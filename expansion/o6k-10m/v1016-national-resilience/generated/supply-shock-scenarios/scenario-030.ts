import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 030 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_030_META = {
  id: 'shock_030',
  regionId: 'NT' as V1016NresRegionId,
  primarySystem: 'freight' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 26351,
} as const;

const V1016_NRES_SHOCK_SCENARIO_030_COEF = {
  k0: 13.1000,
  k1: 71.6000,
  k2: 31.0000,
  k3: 89.5000,
  k4: 48.9000,
  k5: 8.3000,
  k6: 66.8000,
  k7: 26.2000,
  k8: 84.7000,
  k9: 44.1000,
  k10: 3.5000,
  k11: 62.0000,
  k12: 21.4000,
  k13: 79.9000,
  k14: 39.3000,
  k15: 97.8000,
  k16: 57.2000,
  k17: 16.6000,
  k18: 75.1000,
  k19: 34.5000,
  k20: 93.0000,
  k21: 52.4000,
  k22: 11.8000,
  k23: 70.3000,
  k24: 29.7000,
  k25: 88.2000,
  k26: 47.6000,
  k27: 7.0000,
  k28: 65.5000,
  k29: 24.9000,
  k30: 83.4000,
  k31: 42.8000,
  k32: 2.2000,
  k33: 60.7000,
  k34: 20.1000,
  k35: 78.6000,
  k36: 38.0000,
  k37: 96.5000,
  k38: 55.9000,
  k39: 15.3000,
  k40: 73.8000,
  k41: 33.2000,
  k42: 91.7000,
  k43: 51.1000,
  k44: 10.5000,
  k45: 69.0000,
  k46: 28.4000,
  k47: 86.9000,
  k48: 46.3000,
  k49: 5.7000,
  k50: 64.2000,
  k51: 23.6000,
  k52: 82.1000,
  k53: 41.5000,
  k54: 0.9000,
  k55: 59.4000,
  k56: 18.8000,
  k57: 77.3000,
  k58: 36.7000,
  k59: 95.2000,
  k60: 54.6000,
  k61: 14.0000,
  k62: 72.5000,
  k63: 31.9000,
  k64: 90.4000,
  k65: 49.8000,
  k66: 9.2000,
  k67: 67.7000,
  k68: 27.1000,
  k69: 85.6000,
  k70: 45.0000,
  k71: 4.4000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_030_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_030_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_030_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_030_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_030_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_030_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_030_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_030_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_030_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_030_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_030_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_030_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
