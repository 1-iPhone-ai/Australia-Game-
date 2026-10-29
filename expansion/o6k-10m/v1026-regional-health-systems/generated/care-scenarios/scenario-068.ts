import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 068 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_068_META = {
  id: 'stress_068',
  regionId: 'SA' as V1026RhsRegionId,
  primaryChannel: 'regional' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 62469,
} as const;

const V1026_RHS_CARE_SCENARIO_068_COEF = {
  k0: 22.6000,
  k1: 88.1000,
  k2: 53.9000,
  k3: 19.7000,
  k4: 85.2000,
  k5: 51.0000,
  k6: 16.8000,
  k7: 82.3000,
  k8: 48.1000,
  k9: 13.9000,
  k10: 79.4000,
  k11: 45.2000,
  k12: 11.0000,
  k13: 76.5000,
  k14: 42.3000,
  k15: 8.1000,
  k16: 73.6000,
  k17: 39.4000,
  k18: 5.2000,
  k19: 70.7000,
  k20: 36.5000,
  k21: 2.3000,
  k22: 67.8000,
  k23: 33.6000,
  k24: 99.1000,
  k25: 64.9000,
  k26: 30.7000,
  k27: 96.2000,
  k28: 62.0000,
  k29: 27.8000,
  k30: 93.3000,
  k31: 59.1000,
  k32: 24.9000,
  k33: 90.4000,
  k34: 56.2000,
  k35: 22.0000,
  k36: 87.5000,
  k37: 53.3000,
  k38: 19.1000,
  k39: 84.6000,
  k40: 50.4000,
  k41: 16.2000,
  k42: 81.7000,
  k43: 47.5000,
  k44: 13.3000,
  k45: 78.8000,
  k46: 44.6000,
  k47: 10.4000,
  k48: 75.9000,
  k49: 41.7000,
  k50: 7.5000,
  k51: 73.0000,
  k52: 38.8000,
  k53: 4.6000,
  k54: 70.1000,
  k55: 35.9000,
  k56: 1.7000,
  k57: 67.2000,
  k58: 33.0000,
  k59: 98.5000,
  k60: 64.3000,
  k61: 30.1000,
  k62: 95.6000,
  k63: 61.4000,
  k64: 27.2000,
  k65: 92.7000,
  k66: 58.5000,
  k67: 24.3000,
  k68: 89.8000,
  k69: 55.6000,
  k70: 21.4000,
  k71: 86.9000,
} as const;

export function V1026_RHS_CARE_SCENARIO_068_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_068_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_068_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_068_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_068_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_068_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_068_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_068_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_068_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_068_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_068_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_068_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
