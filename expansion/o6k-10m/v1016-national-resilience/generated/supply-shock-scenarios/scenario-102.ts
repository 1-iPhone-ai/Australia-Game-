import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 102 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_102_META = {
  id: 'shock_102',
  regionId: 'NT' as V1016NresRegionId,
  primarySystem: 'water' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 89495,
} as const;

const V1016_NRES_SHOCK_SCENARIO_102_COEF = {
  k0: 15.3000,
  k1: 45.8000,
  k2: 76.3000,
  k3: 7.7000,
  k4: 38.2000,
  k5: 68.7000,
  k6: 0.1000,
  k7: 30.6000,
  k8: 61.1000,
  k9: 91.6000,
  k10: 23.0000,
  k11: 53.5000,
  k12: 84.0000,
  k13: 15.4000,
  k14: 45.9000,
  k15: 76.4000,
  k16: 7.8000,
  k17: 38.3000,
  k18: 68.8000,
  k19: 0.2000,
  k20: 30.7000,
  k21: 61.2000,
  k22: 91.7000,
  k23: 23.1000,
  k24: 53.6000,
  k25: 84.1000,
  k26: 15.5000,
  k27: 46.0000,
  k28: 76.5000,
  k29: 7.9000,
  k30: 38.4000,
  k31: 68.9000,
  k32: 0.3000,
  k33: 30.8000,
  k34: 61.3000,
  k35: 91.8000,
  k36: 23.2000,
  k37: 53.7000,
  k38: 84.2000,
  k39: 15.6000,
  k40: 46.1000,
  k41: 76.6000,
  k42: 8.0000,
  k43: 38.5000,
  k44: 69.0000,
  k45: 0.4000,
  k46: 30.9000,
  k47: 61.4000,
  k48: 91.9000,
  k49: 23.3000,
  k50: 53.8000,
  k51: 84.3000,
  k52: 15.7000,
  k53: 46.2000,
  k54: 76.7000,
  k55: 8.1000,
  k56: 38.6000,
  k57: 69.1000,
  k58: 0.5000,
  k59: 31.0000,
  k60: 61.5000,
  k61: 92.0000,
  k62: 23.4000,
  k63: 53.9000,
  k64: 84.4000,
  k65: 15.8000,
  k66: 46.3000,
  k67: 76.8000,
  k68: 8.2000,
  k69: 38.7000,
  k70: 69.2000,
  k71: 0.6000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_102_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_102_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_102_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_102_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_102_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_102_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_102_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_102_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_102_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_102_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_102_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_102_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
