import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 132 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_132_META = {
  id: 'shock_132',
  regionId: 'SA' as V1016NresRegionId,
  primarySystem: 'water' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 115805,
} as const;

const V1016_NRES_SHOCK_SCENARIO_132_COEF = {
  k0: 98.8000,
  k1: 84.6000,
  k2: 70.4000,
  k3: 56.2000,
  k4: 42.0000,
  k5: 27.8000,
  k6: 13.6000,
  k7: 98.5000,
  k8: 84.3000,
  k9: 70.1000,
  k10: 55.9000,
  k11: 41.7000,
  k12: 27.5000,
  k13: 13.3000,
  k14: 98.2000,
  k15: 84.0000,
  k16: 69.8000,
  k17: 55.6000,
  k18: 41.4000,
  k19: 27.2000,
  k20: 13.0000,
  k21: 97.9000,
  k22: 83.7000,
  k23: 69.5000,
  k24: 55.3000,
  k25: 41.1000,
  k26: 26.9000,
  k27: 12.7000,
  k28: 97.6000,
  k29: 83.4000,
  k30: 69.2000,
  k31: 55.0000,
  k32: 40.8000,
  k33: 26.6000,
  k34: 12.4000,
  k35: 97.3000,
  k36: 83.1000,
  k37: 68.9000,
  k38: 54.7000,
  k39: 40.5000,
  k40: 26.3000,
  k41: 12.1000,
  k42: 97.0000,
  k43: 82.8000,
  k44: 68.6000,
  k45: 54.4000,
  k46: 40.2000,
  k47: 26.0000,
  k48: 11.8000,
  k49: 96.7000,
  k50: 82.5000,
  k51: 68.3000,
  k52: 54.1000,
  k53: 39.9000,
  k54: 25.7000,
  k55: 11.5000,
  k56: 96.4000,
  k57: 82.2000,
  k58: 68.0000,
  k59: 53.8000,
  k60: 39.6000,
  k61: 25.4000,
  k62: 11.2000,
  k63: 96.1000,
  k64: 81.9000,
  k65: 67.7000,
  k66: 53.5000,
  k67: 39.3000,
  k68: 25.1000,
  k69: 10.9000,
  k70: 95.8000,
  k71: 81.6000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_132_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_132_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_132_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_132_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_132_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_132_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_132_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_132_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_132_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_132_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_132_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_132_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
