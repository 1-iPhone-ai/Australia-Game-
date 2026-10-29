import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 067 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_067_META = {
  id: 'shock_067',
  regionId: 'WA' as V1016NresRegionId,
  primarySystem: 'industrial' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 58800,
} as const;

const V1016_NRES_SHOCK_SCENARIO_067_COEF = {
  k0: 33.5000,
  k1: 66.6000,
  k2: 0.6000,
  k3: 33.7000,
  k4: 66.8000,
  k5: 0.8000,
  k6: 33.9000,
  k7: 67.0000,
  k8: 1.0000,
  k9: 34.1000,
  k10: 67.2000,
  k11: 1.2000,
  k12: 34.3000,
  k13: 67.4000,
  k14: 1.4000,
  k15: 34.5000,
  k16: 67.6000,
  k17: 1.6000,
  k18: 34.7000,
  k19: 67.8000,
  k20: 1.8000,
  k21: 34.9000,
  k22: 68.0000,
  k23: 2.0000,
  k24: 35.1000,
  k25: 68.2000,
  k26: 2.2000,
  k27: 35.3000,
  k28: 68.4000,
  k29: 2.4000,
  k30: 35.5000,
  k31: 68.6000,
  k32: 2.6000,
  k33: 35.7000,
  k34: 68.8000,
  k35: 2.8000,
  k36: 35.9000,
  k37: 69.0000,
  k38: 3.0000,
  k39: 36.1000,
  k40: 69.2000,
  k41: 3.2000,
  k42: 36.3000,
  k43: 69.4000,
  k44: 3.4000,
  k45: 36.5000,
  k46: 69.6000,
  k47: 3.6000,
  k48: 36.7000,
  k49: 69.8000,
  k50: 3.8000,
  k51: 36.9000,
  k52: 70.0000,
  k53: 4.0000,
  k54: 37.1000,
  k55: 70.2000,
  k56: 4.2000,
  k57: 37.3000,
  k58: 70.4000,
  k59: 4.4000,
  k60: 37.5000,
  k61: 70.6000,
  k62: 4.6000,
  k63: 37.7000,
  k64: 70.8000,
  k65: 4.8000,
  k66: 37.9000,
  k67: 71.0000,
  k68: 5.0000,
  k69: 38.1000,
  k70: 71.2000,
  k71: 5.2000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_067_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_067_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_067_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_067_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_067_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_067_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_067_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_067_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_067_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_067_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_067_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_067_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
