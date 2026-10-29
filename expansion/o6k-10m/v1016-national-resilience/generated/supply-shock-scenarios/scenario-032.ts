import { V1016_NRES_clamp, V1016_NRES_continuityFromScore } from '../../engine/national-resilience-utils.ts';
import type {
  V1016NresShockBand,
  V1016NresRegionId,
  V1016NresSupplyShockSnapshot,
  V1016NresSystemDomain,
} from '../../types/core.ts';

/** Generated supply-shock scenario 032 — national resilience / continuity matrix. */
export const V1016_NRES_SHOCK_SCENARIO_032_META = {
  id: 'shock_032',
  regionId: 'NSW' as V1016NresRegionId,
  primarySystem: 'water' as V1016NresSystemDomain,
  shockBand: 'active' as V1016NresShockBand,
  seed: 28105,
} as const;

const V1016_NRES_SHOCK_SCENARIO_032_COEF = {
  k0: 51.7000,
  k1: 87.4000,
  k2: 24.0000,
  k3: 59.7000,
  k4: 95.4000,
  k5: 32.0000,
  k6: 67.7000,
  k7: 4.3000,
  k8: 40.0000,
  k9: 75.7000,
  k10: 12.3000,
  k11: 48.0000,
  k12: 83.7000,
  k13: 20.3000,
  k14: 56.0000,
  k15: 91.7000,
  k16: 28.3000,
  k17: 64.0000,
  k18: 0.6000,
  k19: 36.3000,
  k20: 72.0000,
  k21: 8.6000,
  k22: 44.3000,
  k23: 80.0000,
  k24: 16.6000,
  k25: 52.3000,
  k26: 88.0000,
  k27: 24.6000,
  k28: 60.3000,
  k29: 96.0000,
  k30: 32.6000,
  k31: 68.3000,
  k32: 4.9000,
  k33: 40.6000,
  k34: 76.3000,
  k35: 12.9000,
  k36: 48.6000,
  k37: 84.3000,
  k38: 20.9000,
  k39: 56.6000,
  k40: 92.3000,
  k41: 28.9000,
  k42: 64.6000,
  k43: 1.2000,
  k44: 36.9000,
  k45: 72.6000,
  k46: 9.2000,
  k47: 44.9000,
  k48: 80.6000,
  k49: 17.2000,
  k50: 52.9000,
  k51: 88.6000,
  k52: 25.2000,
  k53: 60.9000,
  k54: 96.6000,
  k55: 33.2000,
  k56: 68.9000,
  k57: 5.5000,
  k58: 41.2000,
  k59: 76.9000,
  k60: 13.5000,
  k61: 49.2000,
  k62: 84.9000,
  k63: 21.5000,
  k64: 57.2000,
  k65: 92.9000,
  k66: 29.5000,
  k67: 65.2000,
  k68: 1.8000,
  k69: 37.5000,
  k70: 73.2000,
  k71: 9.8000,
} as const;

export function V1016_NRES_SHOCK_SCENARIO_032_evaluate(turn: number): {
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1016_NRES_SHOCK_SCENARIO_032_COEF) as Array<
    keyof typeof V1016_NRES_SHOCK_SCENARIO_032_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1016_NRES_SHOCK_SCENARIO_032_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1016_NRES_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const propagationDelayTurns = V1016_NRES_clamp(2 + (acc % 9), 1, 16);
  const continuityScore = V1016_NRES_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1016_NRES_continuityFromScore(continuityScore) !== 'fragile';
  return { severityIndex, propagationDelayTurns, continuityScore, stable };
}

export function V1016_NRES_SHOCK_SCENARIO_032_snapshot(turn: number): V1016NresSupplyShockSnapshot {
  const r = V1016_NRES_SHOCK_SCENARIO_032_evaluate(turn);
  return {
    scenarioId: V1016_NRES_SHOCK_SCENARIO_032_META.id,
    regionId: V1016_NRES_SHOCK_SCENARIO_032_META.regionId,
    systemDomain: V1016_NRES_SHOCK_SCENARIO_032_META.primarySystem,
    shockBand: V1016_NRES_SHOCK_SCENARIO_032_META.shockBand,
    severityIndex: r.severityIndex,
    propagationDelayTurns: r.propagationDelayTurns,
    continuityScore: r.continuityScore,
    continuityBand: V1016_NRES_continuityFromScore(r.continuityScore),
  };
}

export function V1016_NRES_SHOCK_SCENARIO_032_regressionAssert(turn: number): boolean {
  const r = V1016_NRES_SHOCK_SCENARIO_032_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.continuityScore <= 100;
}
