import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 080 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_080_META = {
  id: 'shock_080',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'freight' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 70201,
} as const;

const V1016_NRES_SHOCK_SCENARIO_080_COEF = {
  k0: 86.2000,
  k1: 70.2000,
  k2: 54.2000,
  k3: 38.2000,
  k4: 22.2000,
  k5: 6.2000,
  k6: 89.3000,
  k7: 73.3000,
  k8: 57.3000,
  k9: 41.3000,
  k10: 25.3000,
  k11: 9.3000,
  k12: 92.4000,
  k13: 76.4000,
  k14: 60.4000,
  k15: 44.4000,
  k16: 28.4000,
  k17: 12.4000,
  k18: 95.5000,
  k19: 79.5000,
  k20: 63.5000,
  k21: 47.5000,
  k22: 31.5000,
  k23: 15.5000,
  k24: 98.6000,
  k25: 82.6000,
  k26: 66.6000,
  k27: 50.6000,
  k28: 34.6000,
  k29: 18.6000,
  k30: 2.6000,
  k31: 85.7000,
  k32: 69.7000,
  k33: 53.7000,
  k34: 37.7000,
  k35: 21.7000,
  k36: 5.7000,
  k37: 88.8000,
  k38: 72.8000,
  k39: 56.8000,
  k40: 40.8000,
  k41: 24.8000,
  k42: 8.8000,
  k43: 91.9000,
  k44: 75.9000,
  k45: 59.9000,
  k46: 43.9000,
  k47: 27.9000,
  k48: 11.9000,
  k49: 95.0000,
  k50: 79.0000,
  k51: 63.0000,
  k52: 47.0000,
  k53: 31.0000,
  k54: 15.0000,
  k55: 98.1000,
  k56: 82.1000,
  k57: 66.1000,
  k58: 50.1000,
  k59: 34.1000,
  k60: 18.1000,
  k61: 2.1000,
  k62: 85.2000,
  k63: 69.2000,
  k64: 53.2000,
  k65: 37.2000,
  k66: 21.2000,
  k67: 5.2000,
  k68: 88.3000,
  k69: 72.3000,
  k70: 56.3000,
  k71: 40.3000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_080_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_080_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_080_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_080_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_080_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_080_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_080_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_080_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_080_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_080_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_080_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_080_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
