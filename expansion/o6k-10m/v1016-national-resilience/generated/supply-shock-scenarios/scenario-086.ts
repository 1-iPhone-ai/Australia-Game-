import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 086 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_086_META = {
  id: 'shock_086',
  regionId: 'NT' as V1016NresRegionId,
  primarySystem: 'food' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 75463,
} as const;

const V1016_NRES_SHOCK_SCENARIO_086_COEF = {
  k0: 3.8000,
  k1: 18.5000,
  k2: 33.2000,
  k3: 47.9000,
  k4: 62.6000,
  k5: 77.3000,
  k6: 92.0000,
  k7: 7.6000,
  k8: 22.3000,
  k9: 37.0000,
  k10: 51.7000,
  k11: 66.4000,
  k12: 81.1000,
  k13: 95.8000,
  k14: 11.4000,
  k15: 26.1000,
  k16: 40.8000,
  k17: 55.5000,
  k18: 70.2000,
  k19: 84.9000,
  k20: 0.5000,
  k21: 15.2000,
  k22: 29.9000,
  k23: 44.6000,
  k24: 59.3000,
  k25: 74.0000,
  k26: 88.7000,
  k27: 4.3000,
  k28: 19.0000,
  k29: 33.7000,
  k30: 48.4000,
  k31: 63.1000,
  k32: 77.8000,
  k33: 92.5000,
  k34: 8.1000,
  k35: 22.8000,
  k36: 37.5000,
  k37: 52.2000,
  k38: 66.9000,
  k39: 81.6000,
  k40: 96.3000,
  k41: 11.9000,
  k42: 26.6000,
  k43: 41.3000,
  k44: 56.0000,
  k45: 70.7000,
  k46: 85.4000,
  k47: 1.0000,
  k48: 15.7000,
  k49: 30.4000,
  k50: 45.1000,
  k51: 59.8000,
  k52: 74.5000,
  k53: 89.2000,
  k54: 4.8000,
  k55: 19.5000,
  k56: 34.2000,
  k57: 48.9000,
  k58: 63.6000,
  k59: 78.3000,
  k60: 93.0000,
  k61: 8.6000,
  k62: 23.3000,
  k63: 38.0000,
  k64: 52.7000,
  k65: 67.4000,
  k66: 82.1000,
  k67: 96.8000,
  k68: 12.4000,
  k69: 27.1000,
  k70: 41.8000,
  k71: 56.5000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_086_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_086_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_086_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_086_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_086_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_086_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_086_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_086_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_086_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_086_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_086_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_086_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
