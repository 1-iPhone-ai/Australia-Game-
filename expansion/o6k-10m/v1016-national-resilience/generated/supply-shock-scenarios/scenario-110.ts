import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 110 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_110_META = {
  id: 'shock_110',
  regionId: 'NT' as V1016NresRegionId,
  primarySystem: 'freight' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 96511,
} as const;

const V1016_NRES_SHOCK_SCENARIO_110_COEF = {
  k0: 70.6000,
  k1: 9.9000,
  k2: 48.3000,
  k3: 86.7000,
  k4: 26.0000,
  k5: 64.4000,
  k6: 3.7000,
  k7: 42.1000,
  k8: 80.5000,
  k9: 19.8000,
  k10: 58.2000,
  k11: 96.6000,
  k12: 35.9000,
  k13: 74.3000,
  k14: 13.6000,
  k15: 52.0000,
  k16: 90.4000,
  k17: 29.7000,
  k18: 68.1000,
  k19: 7.4000,
  k20: 45.8000,
  k21: 84.2000,
  k22: 23.5000,
  k23: 61.9000,
  k24: 1.2000,
  k25: 39.6000,
  k26: 78.0000,
  k27: 17.3000,
  k28: 55.7000,
  k29: 94.1000,
  k30: 33.4000,
  k31: 71.8000,
  k32: 11.1000,
  k33: 49.5000,
  k34: 87.9000,
  k35: 27.2000,
  k36: 65.6000,
  k37: 4.9000,
  k38: 43.3000,
  k39: 81.7000,
  k40: 21.0000,
  k41: 59.4000,
  k42: 97.8000,
  k43: 37.1000,
  k44: 75.5000,
  k45: 14.8000,
  k46: 53.2000,
  k47: 91.6000,
  k48: 30.9000,
  k49: 69.3000,
  k50: 8.6000,
  k51: 47.0000,
  k52: 85.4000,
  k53: 24.7000,
  k54: 63.1000,
  k55: 2.4000,
  k56: 40.8000,
  k57: 79.2000,
  k58: 18.5000,
  k59: 56.9000,
  k60: 95.3000,
  k61: 34.6000,
  k62: 73.0000,
  k63: 12.3000,
  k64: 50.7000,
  k65: 89.1000,
  k66: 28.4000,
  k67: 66.8000,
  k68: 6.1000,
  k69: 44.5000,
  k70: 82.9000,
  k71: 22.2000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_110_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_110_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_110_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_110_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_110_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_110_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_110_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_110_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_110_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_110_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_110_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_110_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
