import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 141 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_141_META = {
  id: 'shock_141',
  regionId: 'TAS' as V1016NresRegionId,
  primarySystem: 'energy' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 123698,
} as const;

const V1016_NRES_SHOCK_SCENARIO_141_COEF = {
  k0: 74.3000,
  k1: 56.6000,
  k2: 38.9000,
  k3: 21.2000,
  k4: 3.5000,
  k5: 84.9000,
  k6: 67.2000,
  k7: 49.5000,
  k8: 31.8000,
  k9: 14.1000,
  k10: 95.5000,
  k11: 77.8000,
  k12: 60.1000,
  k13: 42.4000,
  k14: 24.7000,
  k15: 7.0000,
  k16: 88.4000,
  k17: 70.7000,
  k18: 53.0000,
  k19: 35.3000,
  k20: 17.6000,
  k21: 99.0000,
  k22: 81.3000,
  k23: 63.6000,
  k24: 45.9000,
  k25: 28.2000,
  k26: 10.5000,
  k27: 91.9000,
  k28: 74.2000,
  k29: 56.5000,
  k30: 38.8000,
  k31: 21.1000,
  k32: 3.4000,
  k33: 84.8000,
  k34: 67.1000,
  k35: 49.4000,
  k36: 31.7000,
  k37: 14.0000,
  k38: 95.4000,
  k39: 77.7000,
  k40: 60.0000,
  k41: 42.3000,
  k42: 24.6000,
  k43: 6.9000,
  k44: 88.3000,
  k45: 70.6000,
  k46: 52.9000,
  k47: 35.2000,
  k48: 17.5000,
  k49: 98.9000,
  k50: 81.2000,
  k51: 63.5000,
  k52: 45.8000,
  k53: 28.1000,
  k54: 10.4000,
  k55: 91.8000,
  k56: 74.1000,
  k57: 56.4000,
  k58: 38.7000,
  k59: 21.0000,
  k60: 3.3000,
  k61: 84.7000,
  k62: 67.0000,
  k63: 49.3000,
  k64: 31.6000,
  k65: 13.9000,
  k66: 95.3000,
  k67: 77.6000,
  k68: 59.9000,
  k69: 42.2000,
  k70: 24.5000,
  k71: 6.8000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_141_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_141_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_141_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_141_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_141_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_141_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_141_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_141_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_141_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_141_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_141_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_141_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
