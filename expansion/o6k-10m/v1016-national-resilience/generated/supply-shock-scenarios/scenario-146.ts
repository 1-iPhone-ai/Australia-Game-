import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 146 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_146_META = {
  id: 'shock_146',
  regionId: 'QLD' as V1016NresRegionId,
  primarySystem: 'food' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 128083,
} as const;

const V1016_NRES_SHOCK_SCENARIO_146_COEF = {
  k0: 71.7000,
  k1: 96.1000,
  k2: 21.4000,
  k3: 45.8000,
  k4: 70.2000,
  k5: 94.6000,
  k6: 19.9000,
  k7: 44.3000,
  k8: 68.7000,
  k9: 93.1000,
  k10: 18.4000,
  k11: 42.8000,
  k12: 67.2000,
  k13: 91.6000,
  k14: 16.9000,
  k15: 41.3000,
  k16: 65.7000,
  k17: 90.1000,
  k18: 15.4000,
  k19: 39.8000,
  k20: 64.2000,
  k21: 88.6000,
  k22: 13.9000,
  k23: 38.3000,
  k24: 62.7000,
  k25: 87.1000,
  k26: 12.4000,
  k27: 36.8000,
  k28: 61.2000,
  k29: 85.6000,
  k30: 10.9000,
  k31: 35.3000,
  k32: 59.7000,
  k33: 84.1000,
  k34: 9.4000,
  k35: 33.8000,
  k36: 58.2000,
  k37: 82.6000,
  k38: 7.9000,
  k39: 32.3000,
  k40: 56.7000,
  k41: 81.1000,
  k42: 6.4000,
  k43: 30.8000,
  k44: 55.2000,
  k45: 79.6000,
  k46: 4.9000,
  k47: 29.3000,
  k48: 53.7000,
  k49: 78.1000,
  k50: 3.4000,
  k51: 27.8000,
  k52: 52.2000,
  k53: 76.6000,
  k54: 1.9000,
  k55: 26.3000,
  k56: 50.7000,
  k57: 75.1000,
  k58: 0.4000,
  k59: 24.8000,
  k60: 49.2000,
  k61: 73.6000,
  k62: 98.0000,
  k63: 23.3000,
  k64: 47.7000,
  k65: 72.1000,
  k66: 96.5000,
  k67: 21.8000,
  k68: 46.2000,
  k69: 70.6000,
  k70: 95.0000,
  k71: 20.3000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_146_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_146_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_146_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_146_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_146_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_146_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_146_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_146_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_146_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_146_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_146_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_146_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
