import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 147 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_147_META = {
  id: 'shock_147',
  regionId: 'WA' as V1016NresRegionId,
  primarySystem: 'industrial' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 128960,
} as const;

const V1016_NRES_SHOCK_SCENARIO_147_COEF = {
  k0: 91.0000,
  k1: 4.9000,
  k2: 17.9000,
  k3: 30.9000,
  k4: 43.9000,
  k5: 56.9000,
  k6: 69.9000,
  k7: 82.9000,
  k8: 95.9000,
  k9: 9.8000,
  k10: 22.8000,
  k11: 35.8000,
  k12: 48.8000,
  k13: 61.8000,
  k14: 74.8000,
  k15: 87.8000,
  k16: 1.7000,
  k17: 14.7000,
  k18: 27.7000,
  k19: 40.7000,
  k20: 53.7000,
  k21: 66.7000,
  k22: 79.7000,
  k23: 92.7000,
  k24: 6.6000,
  k25: 19.6000,
  k26: 32.6000,
  k27: 45.6000,
  k28: 58.6000,
  k29: 71.6000,
  k30: 84.6000,
  k31: 97.6000,
  k32: 11.5000,
  k33: 24.5000,
  k34: 37.5000,
  k35: 50.5000,
  k36: 63.5000,
  k37: 76.5000,
  k38: 89.5000,
  k39: 3.4000,
  k40: 16.4000,
  k41: 29.4000,
  k42: 42.4000,
  k43: 55.4000,
  k44: 68.4000,
  k45: 81.4000,
  k46: 94.4000,
  k47: 8.3000,
  k48: 21.3000,
  k49: 34.3000,
  k50: 47.3000,
  k51: 60.3000,
  k52: 73.3000,
  k53: 86.3000,
  k54: 0.2000,
  k55: 13.2000,
  k56: 26.2000,
  k57: 39.2000,
  k58: 52.2000,
  k59: 65.2000,
  k60: 78.2000,
  k61: 91.2000,
  k62: 5.1000,
  k63: 18.1000,
  k64: 31.1000,
  k65: 44.1000,
  k66: 57.1000,
  k67: 70.1000,
  k68: 83.1000,
  k69: 96.1000,
  k70: 10.0000,
  k71: 23.0000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_147_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_147_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_147_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_147_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_147_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_147_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_147_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_147_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_147_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_147_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_147_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_147_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
