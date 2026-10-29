import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 028 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_028_META = {
  id: 'shock_028',
  regionId: 'SA' as V1016NresRegionId,
  primarySystem: 'telecom' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 24597,
} as const;

const V1016_NRES_SHOCK_SCENARIO_028_COEF = {
  k0: 73.6000,
  k1: 55.8000,
  k2: 38.0000,
  k3: 20.2000,
  k4: 2.4000,
  k5: 83.7000,
  k6: 65.9000,
  k7: 48.1000,
  k8: 30.3000,
  k9: 12.5000,
  k10: 93.8000,
  k11: 76.0000,
  k12: 58.2000,
  k13: 40.4000,
  k14: 22.6000,
  k15: 4.8000,
  k16: 86.1000,
  k17: 68.3000,
  k18: 50.5000,
  k19: 32.7000,
  k20: 14.9000,
  k21: 96.2000,
  k22: 78.4000,
  k23: 60.6000,
  k24: 42.8000,
  k25: 25.0000,
  k26: 7.2000,
  k27: 88.5000,
  k28: 70.7000,
  k29: 52.9000,
  k30: 35.1000,
  k31: 17.3000,
  k32: 98.6000,
  k33: 80.8000,
  k34: 63.0000,
  k35: 45.2000,
  k36: 27.4000,
  k37: 9.6000,
  k38: 90.9000,
  k39: 73.1000,
  k40: 55.3000,
  k41: 37.5000,
  k42: 19.7000,
  k43: 1.9000,
  k44: 83.2000,
  k45: 65.4000,
  k46: 47.6000,
  k47: 29.8000,
  k48: 12.0000,
  k49: 93.3000,
  k50: 75.5000,
  k51: 57.7000,
  k52: 39.9000,
  k53: 22.1000,
  k54: 4.3000,
  k55: 85.6000,
  k56: 67.8000,
  k57: 50.0000,
  k58: 32.2000,
  k59: 14.4000,
  k60: 95.7000,
  k61: 77.9000,
  k62: 60.1000,
  k63: 42.3000,
  k64: 24.5000,
  k65: 6.7000,
  k66: 88.0000,
  k67: 70.2000,
  k68: 52.4000,
  k69: 34.6000,
  k70: 16.8000,
  k71: 98.1000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_028_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_028_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_028_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_028_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_028_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_028_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_028_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_028_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_028_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_028_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_028_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_028_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
