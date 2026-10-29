import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 098 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_098_META = {
  id: 'shock_098',
  regionId: 'QLD' as V1016NresRegionId,
  primarySystem: 'telecom' as V1016NresSystemDomain,
  shockBand: 'critical' as V1016NresShockBand,
  seed: 85987,
} as const;

const V1016_NRES_SHOCK_SCENARIO_098_COEF = {
  k0: 37.2000,
  k1: 14.2000,
  k2: 90.3000,
  k3: 67.3000,
  k4: 44.3000,
  k5: 21.3000,
  k6: 97.4000,
  k7: 74.4000,
  k8: 51.4000,
  k9: 28.4000,
  k10: 5.4000,
  k11: 81.5000,
  k12: 58.5000,
  k13: 35.5000,
  k14: 12.5000,
  k15: 88.6000,
  k16: 65.6000,
  k17: 42.6000,
  k18: 19.6000,
  k19: 95.7000,
  k20: 72.7000,
  k21: 49.7000,
  k22: 26.7000,
  k23: 3.7000,
  k24: 79.8000,
  k25: 56.8000,
  k26: 33.8000,
  k27: 10.8000,
  k28: 86.9000,
  k29: 63.9000,
  k30: 40.9000,
  k31: 17.9000,
  k32: 94.0000,
  k33: 71.0000,
  k34: 48.0000,
  k35: 25.0000,
  k36: 2.0000,
  k37: 78.1000,
  k38: 55.1000,
  k39: 32.1000,
  k40: 9.1000,
  k41: 85.2000,
  k42: 62.2000,
  k43: 39.2000,
  k44: 16.2000,
  k45: 92.3000,
  k46: 69.3000,
  k47: 46.3000,
  k48: 23.3000,
  k49: 0.3000,
  k50: 76.4000,
  k51: 53.4000,
  k52: 30.4000,
  k53: 7.4000,
  k54: 83.5000,
  k55: 60.5000,
  k56: 37.5000,
  k57: 14.5000,
  k58: 90.6000,
  k59: 67.6000,
  k60: 44.6000,
  k61: 21.6000,
  k62: 97.7000,
  k63: 74.7000,
  k64: 51.7000,
  k65: 28.7000,
  k66: 5.7000,
  k67: 81.8000,
  k68: 58.8000,
  k69: 35.8000,
  k70: 12.8000,
  k71: 88.9000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_098_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_098_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_098_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_098_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_098_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_098_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_098_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_098_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_098_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_098_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_098_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_098_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
