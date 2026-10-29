import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 123 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_123_META = {
  id: 'stress_123',
  regionId: 'WA' as V1026RhsRegionId,
  primaryChannel: 'telehealth' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 112574,
} as const;

const V1026_RHS_CARE_SCENARIO_123_COEF = {
  k0: 4.0000,
  k1: 95.0000,
  k2: 86.3000,
  k3: 77.6000,
  k4: 68.9000,
  k5: 60.2000,
  k6: 51.5000,
  k7: 42.8000,
  k8: 34.1000,
  k9: 25.4000,
  k10: 16.7000,
  k11: 8.0000,
  k12: 99.0000,
  k13: 90.3000,
  k14: 81.6000,
  k15: 72.9000,
  k16: 64.2000,
  k17: 55.5000,
  k18: 46.8000,
  k19: 38.1000,
  k20: 29.4000,
  k21: 20.7000,
  k22: 12.0000,
  k23: 3.3000,
  k24: 94.3000,
  k25: 85.6000,
  k26: 76.9000,
  k27: 68.2000,
  k28: 59.5000,
  k29: 50.8000,
  k30: 42.1000,
  k31: 33.4000,
  k32: 24.7000,
  k33: 16.0000,
  k34: 7.3000,
  k35: 98.3000,
  k36: 89.6000,
  k37: 80.9000,
  k38: 72.2000,
  k39: 63.5000,
  k40: 54.8000,
  k41: 46.1000,
  k42: 37.4000,
  k43: 28.7000,
  k44: 20.0000,
  k45: 11.3000,
  k46: 2.6000,
  k47: 93.6000,
  k48: 84.9000,
  k49: 76.2000,
  k50: 67.5000,
  k51: 58.8000,
  k52: 50.1000,
  k53: 41.4000,
  k54: 32.7000,
  k55: 24.0000,
  k56: 15.3000,
  k57: 6.6000,
  k58: 97.6000,
  k59: 88.9000,
  k60: 80.2000,
  k61: 71.5000,
  k62: 62.8000,
  k63: 54.1000,
  k64: 45.4000,
  k65: 36.7000,
  k66: 28.0000,
  k67: 19.3000,
  k68: 10.6000,
  k69: 1.9000,
  k70: 92.9000,
  k71: 84.2000,
} as const;

export function V1026_RHS_CARE_SCENARIO_123_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_123_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_123_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_123_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_123_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_123_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_123_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_123_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_123_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_123_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_123_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_123_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
