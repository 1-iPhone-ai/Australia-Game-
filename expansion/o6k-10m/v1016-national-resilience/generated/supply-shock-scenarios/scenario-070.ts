import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 070 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_070_META = {
  id: 'shock_070',
  regionId: 'NT' as V1016NresRegionId,
  primarySystem: 'freight' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 61431,
} as const;

const V1016_NRES_SHOCK_SCENARIO_070_COEF = {
  k0: 91.4000,
  k1: 90.3000,
  k2: 89.2000,
  k3: 88.1000,
  k4: 87.0000,
  k5: 85.9000,
  k6: 84.8000,
  k7: 83.7000,
  k8: 82.6000,
  k9: 81.5000,
  k10: 80.4000,
  k11: 79.3000,
  k12: 78.2000,
  k13: 77.1000,
  k14: 76.0000,
  k15: 74.9000,
  k16: 73.8000,
  k17: 72.7000,
  k18: 71.6000,
  k19: 70.5000,
  k20: 69.4000,
  k21: 68.3000,
  k22: 67.2000,
  k23: 66.1000,
  k24: 65.0000,
  k25: 63.9000,
  k26: 62.8000,
  k27: 61.7000,
  k28: 60.6000,
  k29: 59.5000,
  k30: 58.4000,
  k31: 57.3000,
  k32: 56.2000,
  k33: 55.1000,
  k34: 54.0000,
  k35: 52.9000,
  k36: 51.8000,
  k37: 50.7000,
  k38: 49.6000,
  k39: 48.5000,
  k40: 47.4000,
  k41: 46.3000,
  k42: 45.2000,
  k43: 44.1000,
  k44: 43.0000,
  k45: 41.9000,
  k46: 40.8000,
  k47: 39.7000,
  k48: 38.6000,
  k49: 37.5000,
  k50: 36.4000,
  k51: 35.3000,
  k52: 34.2000,
  k53: 33.1000,
  k54: 32.0000,
  k55: 30.9000,
  k56: 29.8000,
  k57: 28.7000,
  k58: 27.6000,
  k59: 26.5000,
  k60: 25.4000,
  k61: 24.3000,
  k62: 23.2000,
  k63: 22.1000,
  k64: 21.0000,
  k65: 19.9000,
  k66: 18.8000,
  k67: 17.7000,
  k68: 16.6000,
  k69: 15.5000,
  k70: 14.4000,
  k71: 13.3000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_070_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_070_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_070_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_070_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_070_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_070_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_070_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_070_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_070_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_070_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_070_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_070_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
