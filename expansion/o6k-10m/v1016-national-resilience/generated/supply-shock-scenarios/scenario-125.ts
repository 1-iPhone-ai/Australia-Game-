import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 125 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_125_META = {
  id: 'shock_125',
  regionId: 'TAS' as V1016NresRegionId,
  primarySystem: 'pharma' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 109666,
} as const;

const V1016_NRES_SHOCK_SCENARIO_125_COEF = {
  k0: 62.8000,
  k1: 29.3000,
  k2: 94.9000,
  k3: 61.4000,
  k4: 27.9000,
  k5: 93.5000,
  k6: 60.0000,
  k7: 26.5000,
  k8: 92.1000,
  k9: 58.6000,
  k10: 25.1000,
  k11: 90.7000,
  k12: 57.2000,
  k13: 23.7000,
  k14: 89.3000,
  k15: 55.8000,
  k16: 22.3000,
  k17: 87.9000,
  k18: 54.4000,
  k19: 20.9000,
  k20: 86.5000,
  k21: 53.0000,
  k22: 19.5000,
  k23: 85.1000,
  k24: 51.6000,
  k25: 18.1000,
  k26: 83.7000,
  k27: 50.2000,
  k28: 16.7000,
  k29: 82.3000,
  k30: 48.8000,
  k31: 15.3000,
  k32: 80.9000,
  k33: 47.4000,
  k34: 13.9000,
  k35: 79.5000,
  k36: 46.0000,
  k37: 12.5000,
  k38: 78.1000,
  k39: 44.6000,
  k40: 11.1000,
  k41: 76.7000,
  k42: 43.2000,
  k43: 9.7000,
  k44: 75.3000,
  k45: 41.8000,
  k46: 8.3000,
  k47: 73.9000,
  k48: 40.4000,
  k49: 6.9000,
  k50: 72.5000,
  k51: 39.0000,
  k52: 5.5000,
  k53: 71.1000,
  k54: 37.6000,
  k55: 4.1000,
  k56: 69.7000,
  k57: 36.2000,
  k58: 2.7000,
  k59: 68.3000,
  k60: 34.8000,
  k61: 1.3000,
  k62: 66.9000,
  k63: 33.4000,
  k64: 99.0000,
  k65: 65.5000,
  k66: 32.0000,
  k67: 97.6000,
  k68: 64.1000,
  k69: 30.6000,
  k70: 96.2000,
  k71: 62.7000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_125_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_125_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_125_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_125_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_125_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_125_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_125_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_125_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_125_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_125_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_125_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_125_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
