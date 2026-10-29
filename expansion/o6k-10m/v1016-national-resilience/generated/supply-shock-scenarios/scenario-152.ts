import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 152 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_152_META = {
  id: 'shock_152',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'water' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 133345,
} as const;

const V1016_NRES_SHOCK_SCENARIO_152_COEF = {
  k0: 88.4000,
  k1: 44.4000,
  k2: 0.4000,
  k3: 55.5000,
  k4: 11.5000,
  k5: 66.6000,
  k6: 22.6000,
  k7: 77.7000,
  k8: 33.7000,
  k9: 88.8000,
  k10: 44.8000,
  k11: 0.8000,
  k12: 55.9000,
  k13: 11.9000,
  k14: 67.0000,
  k15: 23.0000,
  k16: 78.1000,
  k17: 34.1000,
  k18: 89.2000,
  k19: 45.2000,
  k20: 1.2000,
  k21: 56.3000,
  k22: 12.3000,
  k23: 67.4000,
  k24: 23.4000,
  k25: 78.5000,
  k26: 34.5000,
  k27: 89.6000,
  k28: 45.6000,
  k29: 1.6000,
  k30: 56.7000,
  k31: 12.7000,
  k32: 67.8000,
  k33: 23.8000,
  k34: 78.9000,
  k35: 34.9000,
  k36: 90.0000,
  k37: 46.0000,
  k38: 2.0000,
  k39: 57.1000,
  k40: 13.1000,
  k41: 68.2000,
  k42: 24.2000,
  k43: 79.3000,
  k44: 35.3000,
  k45: 90.4000,
  k46: 46.4000,
  k47: 2.4000,
  k48: 57.5000,
  k49: 13.5000,
  k50: 68.6000,
  k51: 24.6000,
  k52: 79.7000,
  k53: 35.7000,
  k54: 90.8000,
  k55: 46.8000,
  k56: 2.8000,
  k57: 57.9000,
  k58: 13.9000,
  k59: 69.0000,
  k60: 25.0000,
  k61: 80.1000,
  k62: 36.1000,
  k63: 91.2000,
  k64: 47.2000,
  k65: 3.2000,
  k66: 58.3000,
  k67: 14.3000,
  k68: 69.4000,
  k69: 25.4000,
  k70: 80.5000,
  k71: 36.5000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_152_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_152_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_152_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_152_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_152_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_152_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_152_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_152_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_152_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_152_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_152_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_152_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
