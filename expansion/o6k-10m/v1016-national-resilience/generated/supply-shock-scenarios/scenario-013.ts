import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 013 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_013_META = {
  id: 'shock_013',
  regionId: 'TAS' as V1016NresRegionId,
  primarySystem: 'digital' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 11442,
} as const;

const V1016_NRES_SHOCK_SCENARIO_013_COEF = {
  k0: 81.4000,
  k1: 36.4000,
  k2: 90.5000,
  k3: 45.5000,
  k4: 0.5000,
  k5: 54.6000,
  k6: 9.6000,
  k7: 63.7000,
  k8: 18.7000,
  k9: 72.8000,
  k10: 27.8000,
  k11: 81.9000,
  k12: 36.9000,
  k13: 91.0000,
  k14: 46.0000,
  k15: 1.0000,
  k16: 55.1000,
  k17: 10.1000,
  k18: 64.2000,
  k19: 19.2000,
  k20: 73.3000,
  k21: 28.3000,
  k22: 82.4000,
  k23: 37.4000,
  k24: 91.5000,
  k25: 46.5000,
  k26: 1.5000,
  k27: 55.6000,
  k28: 10.6000,
  k29: 64.7000,
  k30: 19.7000,
  k31: 73.8000,
  k32: 28.8000,
  k33: 82.9000,
  k34: 37.9000,
  k35: 92.0000,
  k36: 47.0000,
  k37: 2.0000,
  k38: 56.1000,
  k39: 11.1000,
  k40: 65.2000,
  k41: 20.2000,
  k42: 74.3000,
  k43: 29.3000,
  k44: 83.4000,
  k45: 38.4000,
  k46: 92.5000,
  k47: 47.5000,
  k48: 2.5000,
  k49: 56.6000,
  k50: 11.6000,
  k51: 65.7000,
  k52: 20.7000,
  k53: 74.8000,
  k54: 29.8000,
  k55: 83.9000,
  k56: 38.9000,
  k57: 93.0000,
  k58: 48.0000,
  k59: 3.0000,
  k60: 57.1000,
  k61: 12.1000,
  k62: 66.2000,
  k63: 21.2000,
  k64: 75.3000,
  k65: 30.3000,
  k66: 84.4000,
  k67: 39.4000,
  k68: 93.5000,
  k69: 48.5000,
  k70: 3.5000,
  k71: 57.6000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_013_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_013_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_013_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_013_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_013_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_013_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_013_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_013_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_013_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_013_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_013_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_013_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
