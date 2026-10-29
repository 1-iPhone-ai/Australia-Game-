import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 073 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_073_META = {
  id: 'shock_073',
  regionId: 'VIC' as V1016NresRegionId,
  primarySystem: 'digital' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 64062,
} as const;

const V1016_NRES_SHOCK_SCENARIO_073_COEF = {
  k0: 50.2000,
  k1: 14.9000,
  k2: 78.7000,
  k3: 43.4000,
  k4: 8.1000,
  k5: 71.9000,
  k6: 36.6000,
  k7: 1.3000,
  k8: 65.1000,
  k9: 29.8000,
  k10: 93.6000,
  k11: 58.3000,
  k12: 23.0000,
  k13: 86.8000,
  k14: 51.5000,
  k15: 16.2000,
  k16: 80.0000,
  k17: 44.7000,
  k18: 9.4000,
  k19: 73.2000,
  k20: 37.9000,
  k21: 2.6000,
  k22: 66.4000,
  k23: 31.1000,
  k24: 94.9000,
  k25: 59.6000,
  k26: 24.3000,
  k27: 88.1000,
  k28: 52.8000,
  k29: 17.5000,
  k30: 81.3000,
  k31: 46.0000,
  k32: 10.7000,
  k33: 74.5000,
  k34: 39.2000,
  k35: 3.9000,
  k36: 67.7000,
  k37: 32.4000,
  k38: 96.2000,
  k39: 60.9000,
  k40: 25.6000,
  k41: 89.4000,
  k42: 54.1000,
  k43: 18.8000,
  k44: 82.6000,
  k45: 47.3000,
  k46: 12.0000,
  k47: 75.8000,
  k48: 40.5000,
  k49: 5.2000,
  k50: 69.0000,
  k51: 33.7000,
  k52: 97.5000,
  k53: 62.2000,
  k54: 26.9000,
  k55: 90.7000,
  k56: 55.4000,
  k57: 20.1000,
  k58: 83.9000,
  k59: 48.6000,
  k60: 13.3000,
  k61: 77.1000,
  k62: 41.8000,
  k63: 6.5000,
  k64: 70.3000,
  k65: 35.0000,
  k66: 98.8000,
  k67: 63.5000,
  k68: 28.2000,
  k69: 92.0000,
  k70: 56.7000,
  k71: 21.4000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_073_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_073_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_073_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_073_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_073_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_073_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_073_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_073_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_073_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_073_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_073_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_073_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
