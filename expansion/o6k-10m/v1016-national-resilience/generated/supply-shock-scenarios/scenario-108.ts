import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 108 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_108_META = {
  id: 'shock_108',
  regionId: 'SA' as V1016NresRegionId,
  primarySystem: 'telecom' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 94757,
} as const;

const V1016_NRES_SHOCK_SCENARIO_108_COEF = {
  k0: 32.0000,
  k1: 93.2000,
  k2: 55.3000,
  k3: 17.4000,
  k4: 78.6000,
  k5: 40.7000,
  k6: 2.8000,
  k7: 64.0000,
  k8: 26.1000,
  k9: 87.3000,
  k10: 49.4000,
  k11: 11.5000,
  k12: 72.7000,
  k13: 34.8000,
  k14: 96.0000,
  k15: 58.1000,
  k16: 20.2000,
  k17: 81.4000,
  k18: 43.5000,
  k19: 5.6000,
  k20: 66.8000,
  k21: 28.9000,
  k22: 90.1000,
  k23: 52.2000,
  k24: 14.3000,
  k25: 75.5000,
  k26: 37.6000,
  k27: 98.8000,
  k28: 60.9000,
  k29: 23.0000,
  k30: 84.2000,
  k31: 46.3000,
  k32: 8.4000,
  k33: 69.6000,
  k34: 31.7000,
  k35: 92.9000,
  k36: 55.0000,
  k37: 17.1000,
  k38: 78.3000,
  k39: 40.4000,
  k40: 2.5000,
  k41: 63.7000,
  k42: 25.8000,
  k43: 87.0000,
  k44: 49.1000,
  k45: 11.2000,
  k46: 72.4000,
  k47: 34.5000,
  k48: 95.7000,
  k49: 57.8000,
  k50: 19.9000,
  k51: 81.1000,
  k52: 43.2000,
  k53: 5.3000,
  k54: 66.5000,
  k55: 28.6000,
  k56: 89.8000,
  k57: 51.9000,
  k58: 14.0000,
  k59: 75.2000,
  k60: 37.3000,
  k61: 98.5000,
  k62: 60.6000,
  k63: 22.7000,
  k64: 83.9000,
  k65: 46.0000,
  k66: 8.1000,
  k67: 69.3000,
  k68: 31.4000,
  k69: 92.6000,
  k70: 54.7000,
  k71: 16.8000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_108_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_108_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_108_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_108_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_108_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_108_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_108_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_108_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_108_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_108_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_108_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_108_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
