import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 077 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_077_META = {
  id: 'shock_077',
  regionId: 'TAS' as V1016NresRegionId,
  primarySystem: 'industrial' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 67570,
} as const;

const V1016_NRES_SHOCK_SCENARIO_077_COEF = {
  k0: 28.3000,
  k1: 46.5000,
  k2: 64.7000,
  k3: 82.9000,
  k4: 2.0000,
  k5: 20.2000,
  k6: 38.4000,
  k7: 56.6000,
  k8: 74.8000,
  k9: 93.0000,
  k10: 12.1000,
  k11: 30.3000,
  k12: 48.5000,
  k13: 66.7000,
  k14: 84.9000,
  k15: 4.0000,
  k16: 22.2000,
  k17: 40.4000,
  k18: 58.6000,
  k19: 76.8000,
  k20: 95.0000,
  k21: 14.1000,
  k22: 32.3000,
  k23: 50.5000,
  k24: 68.7000,
  k25: 86.9000,
  k26: 6.0000,
  k27: 24.2000,
  k28: 42.4000,
  k29: 60.6000,
  k30: 78.8000,
  k31: 97.0000,
  k32: 16.1000,
  k33: 34.3000,
  k34: 52.5000,
  k35: 70.7000,
  k36: 88.9000,
  k37: 8.0000,
  k38: 26.2000,
  k39: 44.4000,
  k40: 62.6000,
  k41: 80.8000,
  k42: 99.0000,
  k43: 18.1000,
  k44: 36.3000,
  k45: 54.5000,
  k46: 72.7000,
  k47: 90.9000,
  k48: 10.0000,
  k49: 28.2000,
  k50: 46.4000,
  k51: 64.6000,
  k52: 82.8000,
  k53: 1.9000,
  k54: 20.1000,
  k55: 38.3000,
  k56: 56.5000,
  k57: 74.7000,
  k58: 92.9000,
  k59: 12.0000,
  k60: 30.2000,
  k61: 48.4000,
  k62: 66.6000,
  k63: 84.8000,
  k64: 3.9000,
  k65: 22.1000,
  k66: 40.3000,
  k67: 58.5000,
  k68: 76.7000,
  k69: 94.9000,
  k70: 14.0000,
  k71: 32.2000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_077_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_077_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_077_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_077_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_077_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_077_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_077_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_077_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_077_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_077_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_077_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_077_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
