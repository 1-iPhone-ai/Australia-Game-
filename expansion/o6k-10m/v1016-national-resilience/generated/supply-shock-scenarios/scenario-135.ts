import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 135 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_135_META = {
  id: 'shock_135',
  regionId: 'ACT' as V1016NresRegionId,
  primarySystem: 'pharma' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 118436,
} as const;

const V1016_NRES_SHOCK_SCENARIO_135_COEF = {
  k0: 57.6000,
  k1: 9.2000,
  k2: 59.9000,
  k3: 11.5000,
  k4: 62.2000,
  k5: 13.8000,
  k6: 64.5000,
  k7: 16.1000,
  k8: 66.8000,
  k9: 18.4000,
  k10: 69.1000,
  k11: 20.7000,
  k12: 71.4000,
  k13: 23.0000,
  k14: 73.7000,
  k15: 25.3000,
  k16: 76.0000,
  k17: 27.6000,
  k18: 78.3000,
  k19: 29.9000,
  k20: 80.6000,
  k21: 32.2000,
  k22: 82.9000,
  k23: 34.5000,
  k24: 85.2000,
  k25: 36.8000,
  k26: 87.5000,
  k27: 39.1000,
  k28: 89.8000,
  k29: 41.4000,
  k30: 92.1000,
  k31: 43.7000,
  k32: 94.4000,
  k33: 46.0000,
  k34: 96.7000,
  k35: 48.3000,
  k36: 99.0000,
  k37: 50.6000,
  k38: 2.2000,
  k39: 52.9000,
  k40: 4.5000,
  k41: 55.2000,
  k42: 6.8000,
  k43: 57.5000,
  k44: 9.1000,
  k45: 59.8000,
  k46: 11.4000,
  k47: 62.1000,
  k48: 13.7000,
  k49: 64.4000,
  k50: 16.0000,
  k51: 66.7000,
  k52: 18.3000,
  k53: 69.0000,
  k54: 20.6000,
  k55: 71.3000,
  k56: 22.9000,
  k57: 73.6000,
  k58: 25.2000,
  k59: 75.9000,
  k60: 27.5000,
  k61: 78.2000,
  k62: 29.8000,
  k63: 80.5000,
  k64: 32.1000,
  k65: 82.8000,
  k66: 34.4000,
  k67: 85.1000,
  k68: 36.7000,
  k69: 87.4000,
  k70: 39.0000,
  k71: 89.7000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_135_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_135_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_135_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_135_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_135_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_135_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_135_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_135_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_135_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_135_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_135_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_135_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
