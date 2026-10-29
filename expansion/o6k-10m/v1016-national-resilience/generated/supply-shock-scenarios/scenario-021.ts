import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 021 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_021_META = {
  id: 'shock_021',
  regionId: 'TAS' as V1016NresRegionId,
  primarySystem: 'energy' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 18458,
} as const;

const V1016_NRES_SHOCK_SCENARIO_021_COEF = {
  k0: 37.6000,
  k1: 0.5000,
  k2: 62.5000,
  k3: 25.4000,
  k4: 87.4000,
  k5: 50.3000,
  k6: 13.2000,
  k7: 75.2000,
  k8: 38.1000,
  k9: 1.0000,
  k10: 63.0000,
  k11: 25.9000,
  k12: 87.9000,
  k13: 50.8000,
  k14: 13.7000,
  k15: 75.7000,
  k16: 38.6000,
  k17: 1.5000,
  k18: 63.5000,
  k19: 26.4000,
  k20: 88.4000,
  k21: 51.3000,
  k22: 14.2000,
  k23: 76.2000,
  k24: 39.1000,
  k25: 2.0000,
  k26: 64.0000,
  k27: 26.9000,
  k28: 88.9000,
  k29: 51.8000,
  k30: 14.7000,
  k31: 76.7000,
  k32: 39.6000,
  k33: 2.5000,
  k34: 64.5000,
  k35: 27.4000,
  k36: 89.4000,
  k37: 52.3000,
  k38: 15.2000,
  k39: 77.2000,
  k40: 40.1000,
  k41: 3.0000,
  k42: 65.0000,
  k43: 27.9000,
  k44: 89.9000,
  k45: 52.8000,
  k46: 15.7000,
  k47: 77.7000,
  k48: 40.6000,
  k49: 3.5000,
  k50: 65.5000,
  k51: 28.4000,
  k52: 90.4000,
  k53: 53.3000,
  k54: 16.2000,
  k55: 78.2000,
  k56: 41.1000,
  k57: 4.0000,
  k58: 66.0000,
  k59: 28.9000,
  k60: 90.9000,
  k61: 53.8000,
  k62: 16.7000,
  k63: 78.7000,
  k64: 41.6000,
  k65: 4.5000,
  k66: 66.5000,
  k67: 29.4000,
  k68: 91.4000,
  k69: 54.3000,
  k70: 17.2000,
  k71: 79.2000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_021_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_021_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_021_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_021_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_021_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_021_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_021_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_021_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_021_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_021_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_021_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_021_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
