import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 007 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_007_META = {
  id: 'stress_007',
  regionId: 'ACT' as V1026RhsRegionId,
  primaryChannel: 'mental_health' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 6898,
} as const;

const V1026_RHS_CARE_SCENARIO_007_COEF = {
  k0: 10.6000,
  k1: 2.5000,
  k2: 94.1000,
  k3: 86.0000,
  k4: 77.9000,
  k5: 69.8000,
  k6: 61.7000,
  k7: 53.6000,
  k8: 45.5000,
  k9: 37.4000,
  k10: 29.3000,
  k11: 21.2000,
  k12: 13.1000,
  k13: 5.0000,
  k14: 96.6000,
  k15: 88.5000,
  k16: 80.4000,
  k17: 72.3000,
  k18: 64.2000,
  k19: 56.1000,
  k20: 48.0000,
  k21: 39.9000,
  k22: 31.8000,
  k23: 23.7000,
  k24: 15.6000,
  k25: 7.5000,
  k26: 99.1000,
  k27: 91.0000,
  k28: 82.9000,
  k29: 74.8000,
  k30: 66.7000,
  k31: 58.6000,
  k32: 50.5000,
  k33: 42.4000,
  k34: 34.3000,
  k35: 26.2000,
  k36: 18.1000,
  k37: 10.0000,
  k38: 1.9000,
  k39: 93.5000,
  k40: 85.4000,
  k41: 77.3000,
  k42: 69.2000,
  k43: 61.1000,
  k44: 53.0000,
  k45: 44.9000,
  k46: 36.8000,
  k47: 28.7000,
  k48: 20.6000,
  k49: 12.5000,
  k50: 4.4000,
  k51: 96.0000,
  k52: 87.9000,
  k53: 79.8000,
  k54: 71.7000,
  k55: 63.6000,
  k56: 55.5000,
  k57: 47.4000,
  k58: 39.3000,
  k59: 31.2000,
  k60: 23.1000,
  k61: 15.0000,
  k62: 6.9000,
  k63: 98.5000,
  k64: 90.4000,
  k65: 82.3000,
  k66: 74.2000,
  k67: 66.1000,
  k68: 58.0000,
  k69: 49.9000,
  k70: 41.8000,
  k71: 33.7000,
} as const;

export function V1026_RHS_CARE_SCENARIO_007_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_007_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_007_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_007_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_007_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_007_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_007_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_007_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_007_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_007_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_007_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_007_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
