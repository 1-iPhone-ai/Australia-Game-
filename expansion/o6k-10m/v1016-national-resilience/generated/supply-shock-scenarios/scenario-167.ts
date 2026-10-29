import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 167 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_167_META = {
  id: 'shock_167',
  regionId: 'ACT' as V1016NresRegionId,
  primarySystem: 'industrial' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 146500,
} as const;

const V1016_NRES_SHOCK_SCENARIO_167_COEF = {
  k0: 80.6000,
  k1: 63.8000,
  k2: 47.0000,
  k3: 30.2000,
  k4: 13.4000,
  k5: 95.7000,
  k6: 78.9000,
  k7: 62.1000,
  k8: 45.3000,
  k9: 28.5000,
  k10: 11.7000,
  k11: 94.0000,
  k12: 77.2000,
  k13: 60.4000,
  k14: 43.6000,
  k15: 26.8000,
  k16: 10.0000,
  k17: 92.3000,
  k18: 75.5000,
  k19: 58.7000,
  k20: 41.9000,
  k21: 25.1000,
  k22: 8.3000,
  k23: 90.6000,
  k24: 73.8000,
  k25: 57.0000,
  k26: 40.2000,
  k27: 23.4000,
  k28: 6.6000,
  k29: 88.9000,
  k30: 72.1000,
  k31: 55.3000,
  k32: 38.5000,
  k33: 21.7000,
  k34: 4.9000,
  k35: 87.2000,
  k36: 70.4000,
  k37: 53.6000,
  k38: 36.8000,
  k39: 20.0000,
  k40: 3.2000,
  k41: 85.5000,
  k42: 68.7000,
  k43: 51.9000,
  k44: 35.1000,
  k45: 18.3000,
  k46: 1.5000,
  k47: 83.8000,
  k48: 67.0000,
  k49: 50.2000,
  k50: 33.4000,
  k51: 16.6000,
  k52: 98.9000,
  k53: 82.1000,
  k54: 65.3000,
  k55: 48.5000,
  k56: 31.7000,
  k57: 14.9000,
  k58: 97.2000,
  k59: 80.4000,
  k60: 63.6000,
  k61: 46.8000,
  k62: 30.0000,
  k63: 13.2000,
  k64: 95.5000,
  k65: 78.7000,
  k66: 61.9000,
  k67: 45.1000,
  k68: 28.3000,
  k69: 11.5000,
  k70: 93.8000,
  k71: 77.0000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_167_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_167_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_167_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_167_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_167_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_167_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_167_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_167_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_167_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_167_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_167_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_167_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
