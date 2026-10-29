import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 015 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_015_META = {
  id: 'shock_015',
  regionId: 'ACT' as V1016NresRegionId,
  primarySystem: 'pharma' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 13196,
} as const;

const V1016_NRES_SHOCK_SCENARIO_015_COEF = {
  k0: 20.9000,
  k1: 52.2000,
  k2: 83.5000,
  k3: 15.7000,
  k4: 47.0000,
  k5: 78.3000,
  k6: 10.5000,
  k7: 41.8000,
  k8: 73.1000,
  k9: 5.3000,
  k10: 36.6000,
  k11: 67.9000,
  k12: 0.1000,
  k13: 31.4000,
  k14: 62.7000,
  k15: 94.0000,
  k16: 26.2000,
  k17: 57.5000,
  k18: 88.8000,
  k19: 21.0000,
  k20: 52.3000,
  k21: 83.6000,
  k22: 15.8000,
  k23: 47.1000,
  k24: 78.4000,
  k25: 10.6000,
  k26: 41.9000,
  k27: 73.2000,
  k28: 5.4000,
  k29: 36.7000,
  k30: 68.0000,
  k31: 0.2000,
  k32: 31.5000,
  k33: 62.8000,
  k34: 94.1000,
  k35: 26.3000,
  k36: 57.6000,
  k37: 88.9000,
  k38: 21.1000,
  k39: 52.4000,
  k40: 83.7000,
  k41: 15.9000,
  k42: 47.2000,
  k43: 78.5000,
  k44: 10.7000,
  k45: 42.0000,
  k46: 73.3000,
  k47: 5.5000,
  k48: 36.8000,
  k49: 68.1000,
  k50: 0.3000,
  k51: 31.6000,
  k52: 62.9000,
  k53: 94.2000,
  k54: 26.4000,
  k55: 57.7000,
  k56: 89.0000,
  k57: 21.2000,
  k58: 52.5000,
  k59: 83.8000,
  k60: 16.0000,
  k61: 47.3000,
  k62: 78.6000,
  k63: 10.8000,
  k64: 42.1000,
  k65: 73.4000,
  k66: 5.6000,
  k67: 36.9000,
  k68: 68.2000,
  k69: 0.4000,
  k70: 31.7000,
  k71: 63.0000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_015_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_015_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_015_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_015_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_015_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_015_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_015_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_015_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_015_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_015_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_015_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_015_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
