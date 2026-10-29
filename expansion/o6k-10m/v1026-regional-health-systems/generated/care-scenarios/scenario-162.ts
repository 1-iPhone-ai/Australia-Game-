import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 162 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_162_META = {
  id: 'stress_162',
  regionId: 'QLD' as V1026RhsRegionId,
  primaryChannel: 'hospital_network' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 148103,
} as const;

const V1026_RHS_CARE_SCENARIO_162_COEF = {
  k0: 3.5000,
  k1: 58.2000,
  k2: 13.2000,
  k3: 67.9000,
  k4: 22.9000,
  k5: 77.6000,
  k6: 32.6000,
  k7: 87.3000,
  k8: 42.3000,
  k9: 97.0000,
  k10: 52.0000,
  k11: 7.0000,
  k12: 61.7000,
  k13: 16.7000,
  k14: 71.4000,
  k15: 26.4000,
  k16: 81.1000,
  k17: 36.1000,
  k18: 90.8000,
  k19: 45.8000,
  k20: 0.8000,
  k21: 55.5000,
  k22: 10.5000,
  k23: 65.2000,
  k24: 20.2000,
  k25: 74.9000,
  k26: 29.9000,
  k27: 84.6000,
  k28: 39.6000,
  k29: 94.3000,
  k30: 49.3000,
  k31: 4.3000,
  k32: 59.0000,
  k33: 14.0000,
  k34: 68.7000,
  k35: 23.7000,
  k36: 78.4000,
  k37: 33.4000,
  k38: 88.1000,
  k39: 43.1000,
  k40: 97.8000,
  k41: 52.8000,
  k42: 7.8000,
  k43: 62.5000,
  k44: 17.5000,
  k45: 72.2000,
  k46: 27.2000,
  k47: 81.9000,
  k48: 36.9000,
  k49: 91.6000,
  k50: 46.6000,
  k51: 1.6000,
  k52: 56.3000,
  k53: 11.3000,
  k54: 66.0000,
  k55: 21.0000,
  k56: 75.7000,
  k57: 30.7000,
  k58: 85.4000,
  k59: 40.4000,
  k60: 95.1000,
  k61: 50.1000,
  k62: 5.1000,
  k63: 59.8000,
  k64: 14.8000,
  k65: 69.5000,
  k66: 24.5000,
  k67: 79.2000,
  k68: 34.2000,
  k69: 88.9000,
  k70: 43.9000,
  k71: 98.6000,
} as const;

export function V1026_RHS_CARE_SCENARIO_162_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_162_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_162_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_162_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_162_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_162_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_162_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_162_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_162_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_162_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_162_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_162_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
