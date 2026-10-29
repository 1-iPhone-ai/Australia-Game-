import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 043 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_043_META = {
  id: 'stress_043',
  regionId: 'WA' as V1026RhsRegionId,
  primaryChannel: 'telehealth' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 39694,
} as const;

const V1026_RHS_CARE_SCENARIO_043_COEF = {
  k0: 94.5000,
  k1: 75.9000,
  k2: 57.3000,
  k3: 38.7000,
  k4: 20.1000,
  k5: 1.5000,
  k6: 82.6000,
  k7: 64.0000,
  k8: 45.4000,
  k9: 26.8000,
  k10: 8.2000,
  k11: 89.3000,
  k12: 70.7000,
  k13: 52.1000,
  k14: 33.5000,
  k15: 14.9000,
  k16: 96.0000,
  k17: 77.4000,
  k18: 58.8000,
  k19: 40.2000,
  k20: 21.6000,
  k21: 3.0000,
  k22: 84.1000,
  k23: 65.5000,
  k24: 46.9000,
  k25: 28.3000,
  k26: 9.7000,
  k27: 90.8000,
  k28: 72.2000,
  k29: 53.6000,
  k30: 35.0000,
  k31: 16.4000,
  k32: 97.5000,
  k33: 78.9000,
  k34: 60.3000,
  k35: 41.7000,
  k36: 23.1000,
  k37: 4.5000,
  k38: 85.6000,
  k39: 67.0000,
  k40: 48.4000,
  k41: 29.8000,
  k42: 11.2000,
  k43: 92.3000,
  k44: 73.7000,
  k45: 55.1000,
  k46: 36.5000,
  k47: 17.9000,
  k48: 99.0000,
  k49: 80.4000,
  k50: 61.8000,
  k51: 43.2000,
  k52: 24.6000,
  k53: 6.0000,
  k54: 87.1000,
  k55: 68.5000,
  k56: 49.9000,
  k57: 31.3000,
  k58: 12.7000,
  k59: 93.8000,
  k60: 75.2000,
  k61: 56.6000,
  k62: 38.0000,
  k63: 19.4000,
  k64: 0.8000,
  k65: 81.9000,
  k66: 63.3000,
  k67: 44.7000,
  k68: 26.1000,
  k69: 7.5000,
  k70: 88.6000,
  k71: 70.0000,
} as const;

export function V1026_RHS_CARE_SCENARIO_043_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_043_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_043_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_043_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_043_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_043_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_043_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_043_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_043_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_043_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_043_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_043_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
