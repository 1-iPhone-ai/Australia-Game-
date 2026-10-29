import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 109 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_109_META = {
  id: 'shock_109',
  regionId: 'TAS' as V1016NresRegionId,
  primarySystem: 'finance' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 95634,
} as const;

const V1016_NRES_SHOCK_SCENARIO_109_COEF = {
  k0: 51.3000,
  k1: 2.0000,
  k2: 51.8000,
  k3: 2.5000,
  k4: 52.3000,
  k5: 3.0000,
  k6: 52.8000,
  k7: 3.5000,
  k8: 53.3000,
  k9: 4.0000,
  k10: 53.8000,
  k11: 4.5000,
  k12: 54.3000,
  k13: 5.0000,
  k14: 54.8000,
  k15: 5.5000,
  k16: 55.3000,
  k17: 6.0000,
  k18: 55.8000,
  k19: 6.5000,
  k20: 56.3000,
  k21: 7.0000,
  k22: 56.8000,
  k23: 7.5000,
  k24: 57.3000,
  k25: 8.0000,
  k26: 57.8000,
  k27: 8.5000,
  k28: 58.3000,
  k29: 9.0000,
  k30: 58.8000,
  k31: 9.5000,
  k32: 59.3000,
  k33: 10.0000,
  k34: 59.8000,
  k35: 10.5000,
  k36: 60.3000,
  k37: 11.0000,
  k38: 60.8000,
  k39: 11.5000,
  k40: 61.3000,
  k41: 12.0000,
  k42: 61.8000,
  k43: 12.5000,
  k44: 62.3000,
  k45: 13.0000,
  k46: 62.8000,
  k47: 13.5000,
  k48: 63.3000,
  k49: 14.0000,
  k50: 63.8000,
  k51: 14.5000,
  k52: 64.3000,
  k53: 15.0000,
  k54: 64.8000,
  k55: 15.5000,
  k56: 65.3000,
  k57: 16.0000,
  k58: 65.8000,
  k59: 16.5000,
  k60: 66.3000,
  k61: 17.0000,
  k62: 66.8000,
  k63: 17.5000,
  k64: 67.3000,
  k65: 18.0000,
  k66: 67.8000,
  k67: 18.5000,
  k68: 68.3000,
  k69: 19.0000,
  k70: 68.8000,
  k71: 19.5000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_109_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_109_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_109_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_109_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_109_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_109_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_109_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_109_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_109_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_109_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_109_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_109_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
