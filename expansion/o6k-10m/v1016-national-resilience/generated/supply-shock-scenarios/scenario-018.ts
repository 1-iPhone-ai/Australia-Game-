import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 018 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_018_META = {
  id: 'shock_018',
  regionId: 'QLD' as V1016NresRegionId,
  primarySystem: 'telecom' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 15827,
} as const;

const V1016_NRES_SHOCK_SCENARIO_018_COEF = {
  k0: 78.8000,
  k1: 75.9000,
  k2: 73.0000,
  k3: 70.1000,
  k4: 67.2000,
  k5: 64.3000,
  k6: 61.4000,
  k7: 58.5000,
  k8: 55.6000,
  k9: 52.7000,
  k10: 49.8000,
  k11: 46.9000,
  k12: 44.0000,
  k13: 41.1000,
  k14: 38.2000,
  k15: 35.3000,
  k16: 32.4000,
  k17: 29.5000,
  k18: 26.6000,
  k19: 23.7000,
  k20: 20.8000,
  k21: 17.9000,
  k22: 15.0000,
  k23: 12.1000,
  k24: 9.2000,
  k25: 6.3000,
  k26: 3.4000,
  k27: 0.5000,
  k28: 96.7000,
  k29: 93.8000,
  k30: 90.9000,
  k31: 88.0000,
  k32: 85.1000,
  k33: 82.2000,
  k34: 79.3000,
  k35: 76.4000,
  k36: 73.5000,
  k37: 70.6000,
  k38: 67.7000,
  k39: 64.8000,
  k40: 61.9000,
  k41: 59.0000,
  k42: 56.1000,
  k43: 53.2000,
  k44: 50.3000,
  k45: 47.4000,
  k46: 44.5000,
  k47: 41.6000,
  k48: 38.7000,
  k49: 35.8000,
  k50: 32.9000,
  k51: 30.0000,
  k52: 27.1000,
  k53: 24.2000,
  k54: 21.3000,
  k55: 18.4000,
  k56: 15.5000,
  k57: 12.6000,
  k58: 9.7000,
  k59: 6.8000,
  k60: 3.9000,
  k61: 1.0000,
  k62: 97.2000,
  k63: 94.3000,
  k64: 91.4000,
  k65: 88.5000,
  k66: 85.6000,
  k67: 82.7000,
  k68: 79.8000,
  k69: 76.9000,
  k70: 74.0000,
  k71: 71.1000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_018_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_018_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_018_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_018_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_018_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_018_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_018_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_018_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_018_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_018_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_018_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_018_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
