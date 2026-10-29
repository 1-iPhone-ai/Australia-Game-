import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 024 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_024_META = {
  id: 'shock_024',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'trade' as V1016NresSystemDomain,
  shockBand: 'recovering' as V1016NresShockBand,
  seed: 21089,
} as const;

const V1016_NRES_SHOCK_SCENARIO_024_COEF = {
  k0: 95.5000,
  k1: 24.2000,
  k2: 52.0000,
  k3: 79.8000,
  k4: 8.5000,
  k5: 36.3000,
  k6: 64.1000,
  k7: 91.9000,
  k8: 20.6000,
  k9: 48.4000,
  k10: 76.2000,
  k11: 4.9000,
  k12: 32.7000,
  k13: 60.5000,
  k14: 88.3000,
  k15: 17.0000,
  k16: 44.8000,
  k17: 72.6000,
  k18: 1.3000,
  k19: 29.1000,
  k20: 56.9000,
  k21: 84.7000,
  k22: 13.4000,
  k23: 41.2000,
  k24: 69.0000,
  k25: 96.8000,
  k26: 25.5000,
  k27: 53.3000,
  k28: 81.1000,
  k29: 9.8000,
  k30: 37.6000,
  k31: 65.4000,
  k32: 93.2000,
  k33: 21.9000,
  k34: 49.7000,
  k35: 77.5000,
  k36: 6.2000,
  k37: 34.0000,
  k38: 61.8000,
  k39: 89.6000,
  k40: 18.3000,
  k41: 46.1000,
  k42: 73.9000,
  k43: 2.6000,
  k44: 30.4000,
  k45: 58.2000,
  k46: 86.0000,
  k47: 14.7000,
  k48: 42.5000,
  k49: 70.3000,
  k50: 98.1000,
  k51: 26.8000,
  k52: 54.6000,
  k53: 82.4000,
  k54: 11.1000,
  k55: 38.9000,
  k56: 66.7000,
  k57: 94.5000,
  k58: 23.2000,
  k59: 51.0000,
  k60: 78.8000,
  k61: 7.5000,
  k62: 35.3000,
  k63: 63.1000,
  k64: 90.9000,
  k65: 19.6000,
  k66: 47.4000,
  k67: 75.2000,
  k68: 3.9000,
  k69: 31.7000,
  k70: 59.5000,
  k71: 87.3000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_024_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_024_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_024_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_024_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_024_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_024_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_024_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_024_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_024_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_024_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_024_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_024_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
