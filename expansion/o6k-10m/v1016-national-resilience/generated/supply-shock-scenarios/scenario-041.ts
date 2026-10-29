import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 041 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_041_META = {
  id: 'shock_041',
  regionId: 'VIC' as V1016NresRegionId,
  primarySystem: 'energy' as V1016NresSystemDomain,
  shockBand: 'emerging' as V1016NresShockBand,
  seed: 35998,
} as const;

const V1016_NRES_SHOCK_SCENARIO_041_COEF = {
  k0: 27.2000,
  k1: 59.4000,
  k2: 91.6000,
  k3: 24.7000,
  k4: 56.9000,
  k5: 89.1000,
  k6: 22.2000,
  k7: 54.4000,
  k8: 86.6000,
  k9: 19.7000,
  k10: 51.9000,
  k11: 84.1000,
  k12: 17.2000,
  k13: 49.4000,
  k14: 81.6000,
  k15: 14.7000,
  k16: 46.9000,
  k17: 79.1000,
  k18: 12.2000,
  k19: 44.4000,
  k20: 76.6000,
  k21: 9.7000,
  k22: 41.9000,
  k23: 74.1000,
  k24: 7.2000,
  k25: 39.4000,
  k26: 71.6000,
  k27: 4.7000,
  k28: 36.9000,
  k29: 69.1000,
  k30: 2.2000,
  k31: 34.4000,
  k32: 66.6000,
  k33: 98.8000,
  k34: 31.9000,
  k35: 64.1000,
  k36: 96.3000,
  k37: 29.4000,
  k38: 61.6000,
  k39: 93.8000,
  k40: 26.9000,
  k41: 59.1000,
  k42: 91.3000,
  k43: 24.4000,
  k44: 56.6000,
  k45: 88.8000,
  k46: 21.9000,
  k47: 54.1000,
  k48: 86.3000,
  k49: 19.4000,
  k50: 51.6000,
  k51: 83.8000,
  k52: 16.9000,
  k53: 49.1000,
  k54: 81.3000,
  k55: 14.4000,
  k56: 46.6000,
  k57: 78.8000,
  k58: 11.9000,
  k59: 44.1000,
  k60: 76.3000,
  k61: 9.4000,
  k62: 41.6000,
  k63: 73.8000,
  k64: 6.9000,
  k65: 39.1000,
  k66: 71.3000,
  k67: 4.4000,
  k68: 36.6000,
  k69: 68.8000,
  k70: 1.9000,
  k71: 34.1000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_041_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_041_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_041_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_041_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_041_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_041_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_041_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_041_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_041_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_041_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_041_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_041_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
