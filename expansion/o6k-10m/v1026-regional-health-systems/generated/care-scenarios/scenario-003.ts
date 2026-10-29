import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 003 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_003_META = {
  id: 'stress_003',
  regionId: 'WA' as V1026RhsRegionId,
  primaryChannel: 'telehealth' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 3254,
} as const;

const V1026_RHS_CARE_SCENARIO_003_COEF = {
  k0: 89.9000,
  k1: 16.5000,
  k2: 42.8000,
  k3: 69.1000,
  k4: 95.4000,
  k5: 22.0000,
  k6: 48.3000,
  k7: 74.6000,
  k8: 1.2000,
  k9: 27.5000,
  k10: 53.8000,
  k11: 80.1000,
  k12: 6.7000,
  k13: 33.0000,
  k14: 59.3000,
  k15: 85.6000,
  k16: 12.2000,
  k17: 38.5000,
  k18: 64.8000,
  k19: 91.1000,
  k20: 17.7000,
  k21: 44.0000,
  k22: 70.3000,
  k23: 96.6000,
  k24: 23.2000,
  k25: 49.5000,
  k26: 75.8000,
  k27: 2.4000,
  k28: 28.7000,
  k29: 55.0000,
  k30: 81.3000,
  k31: 7.9000,
  k32: 34.2000,
  k33: 60.5000,
  k34: 86.8000,
  k35: 13.4000,
  k36: 39.7000,
  k37: 66.0000,
  k38: 92.3000,
  k39: 18.9000,
  k40: 45.2000,
  k41: 71.5000,
  k42: 97.8000,
  k43: 24.4000,
  k44: 50.7000,
  k45: 77.0000,
  k46: 3.6000,
  k47: 29.9000,
  k48: 56.2000,
  k49: 82.5000,
  k50: 9.1000,
  k51: 35.4000,
  k52: 61.7000,
  k53: 88.0000,
  k54: 14.6000,
  k55: 40.9000,
  k56: 67.2000,
  k57: 93.5000,
  k58: 20.1000,
  k59: 46.4000,
  k60: 72.7000,
  k61: 99.0000,
  k62: 25.6000,
  k63: 51.9000,
  k64: 78.2000,
  k65: 4.8000,
  k66: 31.1000,
  k67: 57.4000,
  k68: 83.7000,
  k69: 10.3000,
  k70: 36.6000,
  k71: 62.9000,
} as const;

export function V1026_RHS_CARE_SCENARIO_003_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_003_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_003_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_003_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_003_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_003_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_003_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_003_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_003_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_003_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_003_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_003_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
