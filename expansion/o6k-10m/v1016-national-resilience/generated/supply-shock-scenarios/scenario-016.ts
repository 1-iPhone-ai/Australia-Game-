import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 016 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_016_META = {
  id: 'shock_016',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'food' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 14073,
} as const;

const V1016_NRES_SHOCK_SCENARIO_016_COEF = {
  k0: 40.2000,
  k1: 60.1000,
  k2: 80.0000,
  k3: 0.8000,
  k4: 20.7000,
  k5: 40.6000,
  k6: 60.5000,
  k7: 80.4000,
  k8: 1.2000,
  k9: 21.1000,
  k10: 41.0000,
  k11: 60.9000,
  k12: 80.8000,
  k13: 1.6000,
  k14: 21.5000,
  k15: 41.4000,
  k16: 61.3000,
  k17: 81.2000,
  k18: 2.0000,
  k19: 21.9000,
  k20: 41.8000,
  k21: 61.7000,
  k22: 81.6000,
  k23: 2.4000,
  k24: 22.3000,
  k25: 42.2000,
  k26: 62.1000,
  k27: 82.0000,
  k28: 2.8000,
  k29: 22.7000,
  k30: 42.6000,
  k31: 62.5000,
  k32: 82.4000,
  k33: 3.2000,
  k34: 23.1000,
  k35: 43.0000,
  k36: 62.9000,
  k37: 82.8000,
  k38: 3.6000,
  k39: 23.5000,
  k40: 43.4000,
  k41: 63.3000,
  k42: 83.2000,
  k43: 4.0000,
  k44: 23.9000,
  k45: 43.8000,
  k46: 63.7000,
  k47: 83.6000,
  k48: 4.4000,
  k49: 24.3000,
  k50: 44.2000,
  k51: 64.1000,
  k52: 84.0000,
  k53: 4.8000,
  k54: 24.7000,
  k55: 44.6000,
  k56: 64.5000,
  k57: 84.4000,
  k58: 5.2000,
  k59: 25.1000,
  k60: 45.0000,
  k61: 64.9000,
  k62: 84.8000,
  k63: 5.6000,
  k64: 25.5000,
  k65: 45.4000,
  k66: 65.3000,
  k67: 85.2000,
  k68: 6.0000,
  k69: 25.9000,
  k70: 45.8000,
  k71: 65.7000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_016_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_016_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_016_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_016_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_016_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_016_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_016_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_016_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_016_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_016_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_016_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_016_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
