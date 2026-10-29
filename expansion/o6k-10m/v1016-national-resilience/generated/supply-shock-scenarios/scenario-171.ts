import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 171 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_171_META = {
  id: 'shock_171',
  regionId: 'WA' as V1016NresRegionId,
  primarySystem: 'energy' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 150008,
} as const;

const V1016_NRES_SHOCK_SCENARIO_171_COEF = {
  k0: 58.7000,
  k1: 95.4000,
  k2: 33.0000,
  k3: 69.7000,
  k4: 7.3000,
  k5: 44.0000,
  k6: 80.7000,
  k7: 18.3000,
  k8: 55.0000,
  k9: 91.7000,
  k10: 29.3000,
  k11: 66.0000,
  k12: 3.6000,
  k13: 40.3000,
  k14: 77.0000,
  k15: 14.6000,
  k16: 51.3000,
  k17: 88.0000,
  k18: 25.6000,
  k19: 62.3000,
  k20: 99.0000,
  k21: 36.6000,
  k22: 73.3000,
  k23: 10.9000,
  k24: 47.6000,
  k25: 84.3000,
  k26: 21.9000,
  k27: 58.6000,
  k28: 95.3000,
  k29: 32.9000,
  k30: 69.6000,
  k31: 7.2000,
  k32: 43.9000,
  k33: 80.6000,
  k34: 18.2000,
  k35: 54.9000,
  k36: 91.6000,
  k37: 29.2000,
  k38: 65.9000,
  k39: 3.5000,
  k40: 40.2000,
  k41: 76.9000,
  k42: 14.5000,
  k43: 51.2000,
  k44: 87.9000,
  k45: 25.5000,
  k46: 62.2000,
  k47: 98.9000,
  k48: 36.5000,
  k49: 73.2000,
  k50: 10.8000,
  k51: 47.5000,
  k52: 84.2000,
  k53: 21.8000,
  k54: 58.5000,
  k55: 95.2000,
  k56: 32.8000,
  k57: 69.5000,
  k58: 7.1000,
  k59: 43.8000,
  k60: 80.5000,
  k61: 18.1000,
  k62: 54.8000,
  k63: 91.5000,
  k64: 29.1000,
  k65: 65.8000,
  k66: 3.4000,
  k67: 40.1000,
  k68: 76.8000,
  k69: 14.4000,
  k70: 51.1000,
  k71: 87.8000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_171_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_171_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_171_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_171_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_171_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_171_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_171_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_171_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_171_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_171_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_171_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_171_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
