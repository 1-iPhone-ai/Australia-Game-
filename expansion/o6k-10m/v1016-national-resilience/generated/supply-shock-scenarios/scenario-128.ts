import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 128 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_128_META = {
  id: 'shock_128',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'telecom' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 112297,
} as const;

const V1016_NRES_SHOCK_SCENARIO_128_COEF = {
  k0: 21.6000,
  k1: 53.0000,
  k2: 84.4000,
  k3: 16.7000,
  k4: 48.1000,
  k5: 79.5000,
  k6: 11.8000,
  k7: 43.2000,
  k8: 74.6000,
  k9: 6.9000,
  k10: 38.3000,
  k11: 69.7000,
  k12: 2.0000,
  k13: 33.4000,
  k14: 64.8000,
  k15: 96.2000,
  k16: 28.5000,
  k17: 59.9000,
  k18: 91.3000,
  k19: 23.6000,
  k20: 55.0000,
  k21: 86.4000,
  k22: 18.7000,
  k23: 50.1000,
  k24: 81.5000,
  k25: 13.8000,
  k26: 45.2000,
  k27: 76.6000,
  k28: 8.9000,
  k29: 40.3000,
  k30: 71.7000,
  k31: 4.0000,
  k32: 35.4000,
  k33: 66.8000,
  k34: 98.2000,
  k35: 30.5000,
  k36: 61.9000,
  k37: 93.3000,
  k38: 25.6000,
  k39: 57.0000,
  k40: 88.4000,
  k41: 20.7000,
  k42: 52.1000,
  k43: 83.5000,
  k44: 15.8000,
  k45: 47.2000,
  k46: 78.6000,
  k47: 10.9000,
  k48: 42.3000,
  k49: 73.7000,
  k50: 6.0000,
  k51: 37.4000,
  k52: 68.8000,
  k53: 1.1000,
  k54: 32.5000,
  k55: 63.9000,
  k56: 95.3000,
  k57: 27.6000,
  k58: 59.0000,
  k59: 90.4000,
  k60: 22.7000,
  k61: 54.1000,
  k62: 85.5000,
  k63: 17.8000,
  k64: 49.2000,
  k65: 80.6000,
  k66: 12.9000,
  k67: 44.3000,
  k68: 75.7000,
  k69: 8.0000,
  k70: 39.4000,
  k71: 70.8000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_128_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_128_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_128_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_128_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_128_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_128_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_128_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_128_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_128_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_128_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_128_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_128_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
