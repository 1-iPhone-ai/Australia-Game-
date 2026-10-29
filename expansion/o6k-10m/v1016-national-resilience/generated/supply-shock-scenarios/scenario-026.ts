import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 026 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_026_META = {
  id: 'shock_026',
  regionId: 'QLD' as V1016NresRegionId,
  primarySystem: 'food' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 22843,
} as const;

const V1016_NRES_SHOCK_SCENARIO_026_COEF = {
  k0: 35.0000,
  k1: 40.0000,
  k2: 45.0000,
  k3: 50.0000,
  k4: 55.0000,
  k5: 60.0000,
  k6: 65.0000,
  k7: 70.0000,
  k8: 75.0000,
  k9: 80.0000,
  k10: 85.0000,
  k11: 90.0000,
  k12: 95.0000,
  k13: 0.9000,
  k14: 5.9000,
  k15: 10.9000,
  k16: 15.9000,
  k17: 20.9000,
  k18: 25.9000,
  k19: 30.9000,
  k20: 35.9000,
  k21: 40.9000,
  k22: 45.9000,
  k23: 50.9000,
  k24: 55.9000,
  k25: 60.9000,
  k26: 65.9000,
  k27: 70.9000,
  k28: 75.9000,
  k29: 80.9000,
  k30: 85.9000,
  k31: 90.9000,
  k32: 95.9000,
  k33: 1.8000,
  k34: 6.8000,
  k35: 11.8000,
  k36: 16.8000,
  k37: 21.8000,
  k38: 26.8000,
  k39: 31.8000,
  k40: 36.8000,
  k41: 41.8000,
  k42: 46.8000,
  k43: 51.8000,
  k44: 56.8000,
  k45: 61.8000,
  k46: 66.8000,
  k47: 71.8000,
  k48: 76.8000,
  k49: 81.8000,
  k50: 86.8000,
  k51: 91.8000,
  k52: 96.8000,
  k53: 2.7000,
  k54: 7.7000,
  k55: 12.7000,
  k56: 17.7000,
  k57: 22.7000,
  k58: 27.7000,
  k59: 32.7000,
  k60: 37.7000,
  k61: 42.7000,
  k62: 47.7000,
  k63: 52.7000,
  k64: 57.7000,
  k65: 62.7000,
  k66: 67.7000,
  k67: 72.7000,
  k68: 77.7000,
  k69: 82.7000,
  k70: 87.7000,
  k71: 92.7000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_026_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_026_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_026_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_026_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_026_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_026_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_026_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_026_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_026_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_026_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_026_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_026_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
