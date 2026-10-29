import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 000 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_000_META = {
  id: 'shock_000',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'freight' as V1016NresSystemDomain,
  shockBand: 'latent' as V1016NresShockBand,
  seed: 41,
} as const;

const V1016_NRES_SHOCK_SCENARIO_000_COEF = {
  k0: 28.7000,
  k1: 32.8000,
  k2: 36.9000,
  k3: 41.0000,
  k4: 45.1000,
  k5: 49.2000,
  k6: 53.3000,
  k7: 57.4000,
  k8: 61.5000,
  k9: 65.6000,
  k10: 69.7000,
  k11: 73.8000,
  k12: 77.9000,
  k13: 82.0000,
  k14: 86.1000,
  k15: 90.2000,
  k16: 94.3000,
  k17: 98.4000,
  k18: 3.4000,
  k19: 7.5000,
  k20: 11.6000,
  k21: 15.7000,
  k22: 19.8000,
  k23: 23.9000,
  k24: 28.0000,
  k25: 32.1000,
  k26: 36.2000,
  k27: 40.3000,
  k28: 44.4000,
  k29: 48.5000,
  k30: 52.6000,
  k31: 56.7000,
  k32: 60.8000,
  k33: 64.9000,
  k34: 69.0000,
  k35: 73.1000,
  k36: 77.2000,
  k37: 81.3000,
  k38: 85.4000,
  k39: 89.5000,
  k40: 93.6000,
  k41: 97.7000,
  k42: 2.7000,
  k43: 6.8000,
  k44: 10.9000,
  k45: 15.0000,
  k46: 19.1000,
  k47: 23.2000,
  k48: 27.3000,
  k49: 31.4000,
  k50: 35.5000,
  k51: 39.6000,
  k52: 43.7000,
  k53: 47.8000,
  k54: 51.9000,
  k55: 56.0000,
  k56: 60.1000,
  k57: 64.2000,
  k58: 68.3000,
  k59: 72.4000,
  k60: 76.5000,
  k61: 80.6000,
  k62: 84.7000,
  k63: 88.8000,
  k64: 92.9000,
  k65: 97.0000,
  k66: 2.0000,
  k67: 6.1000,
  k68: 10.2000,
  k69: 14.3000,
  k70: 18.4000,
  k71: 22.5000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_000_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_000_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_000_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_000_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_000_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_000_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_000_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_000_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_000_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_000_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_000_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_000_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
