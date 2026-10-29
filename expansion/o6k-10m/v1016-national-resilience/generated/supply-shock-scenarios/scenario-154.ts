import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 154 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_154_META = {
  id: 'shock_154',
  regionId: 'QLD' as V1016NresRegionId,
  primarySystem: 'trade' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 135099,
} as const;

const V1016_NRES_SHOCK_SCENARIO_154_COEF = {
  k0: 27.9000,
  k1: 60.2000,
  k2: 92.5000,
  k3: 25.7000,
  k4: 58.0000,
  k5: 90.3000,
  k6: 23.5000,
  k7: 55.8000,
  k8: 88.1000,
  k9: 21.3000,
  k10: 53.6000,
  k11: 85.9000,
  k12: 19.1000,
  k13: 51.4000,
  k14: 83.7000,
  k15: 16.9000,
  k16: 49.2000,
  k17: 81.5000,
  k18: 14.7000,
  k19: 47.0000,
  k20: 79.3000,
  k21: 12.5000,
  k22: 44.8000,
  k23: 77.1000,
  k24: 10.3000,
  k25: 42.6000,
  k26: 74.9000,
  k27: 8.1000,
  k28: 40.4000,
  k29: 72.7000,
  k30: 5.9000,
  k31: 38.2000,
  k32: 70.5000,
  k33: 3.7000,
  k34: 36.0000,
  k35: 68.3000,
  k36: 1.5000,
  k37: 33.8000,
  k38: 66.1000,
  k39: 98.4000,
  k40: 31.6000,
  k41: 63.9000,
  k42: 96.2000,
  k43: 29.4000,
  k44: 61.7000,
  k45: 94.0000,
  k46: 27.2000,
  k47: 59.5000,
  k48: 91.8000,
  k49: 25.0000,
  k50: 57.3000,
  k51: 89.6000,
  k52: 22.8000,
  k53: 55.1000,
  k54: 87.4000,
  k55: 20.6000,
  k56: 52.9000,
  k57: 85.2000,
  k58: 18.4000,
  k59: 50.7000,
  k60: 83.0000,
  k61: 16.2000,
  k62: 48.5000,
  k63: 80.8000,
  k64: 14.0000,
  k65: 46.3000,
  k66: 78.6000,
  k67: 11.8000,
  k68: 44.1000,
  k69: 76.4000,
  k70: 9.6000,
  k71: 41.9000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_154_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_154_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_154_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_154_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_154_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_154_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_154_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_154_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_154_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_154_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_154_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_154_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
