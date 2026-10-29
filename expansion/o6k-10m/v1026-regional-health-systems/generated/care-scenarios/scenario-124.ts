import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 124 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_124_META = {
  id: 'stress_124',
  regionId: 'SA' as V1026RhsRegionId,
  primaryChannel: 'rural_clinic' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'recovering' as V1026RhsHealthSystemBand,
  seed: 113485,
} as const;

const V1026_RHS_CARE_SCENARIO_124_COEF = {
  k0: 9.1000,
  k1: 91.5000,
  k2: 74.2000,
  k3: 56.9000,
  k4: 39.6000,
  k5: 22.3000,
  k6: 5.0000,
  k7: 87.4000,
  k8: 70.1000,
  k9: 52.8000,
  k10: 35.5000,
  k11: 18.2000,
  k12: 0.9000,
  k13: 83.3000,
  k14: 66.0000,
  k15: 48.7000,
  k16: 31.4000,
  k17: 14.1000,
  k18: 96.5000,
  k19: 79.2000,
  k20: 61.9000,
  k21: 44.6000,
  k22: 27.3000,
  k23: 10.0000,
  k24: 92.4000,
  k25: 75.1000,
  k26: 57.8000,
  k27: 40.5000,
  k28: 23.2000,
  k29: 5.9000,
  k30: 88.3000,
  k31: 71.0000,
  k32: 53.7000,
  k33: 36.4000,
  k34: 19.1000,
  k35: 1.8000,
  k36: 84.2000,
  k37: 66.9000,
  k38: 49.6000,
  k39: 32.3000,
  k40: 15.0000,
  k41: 97.4000,
  k42: 80.1000,
  k43: 62.8000,
  k44: 45.5000,
  k45: 28.2000,
  k46: 10.9000,
  k47: 93.3000,
  k48: 76.0000,
  k49: 58.7000,
  k50: 41.4000,
  k51: 24.1000,
  k52: 6.8000,
  k53: 89.2000,
  k54: 71.9000,
  k55: 54.6000,
  k56: 37.3000,
  k57: 20.0000,
  k58: 2.7000,
  k59: 85.1000,
  k60: 67.8000,
  k61: 50.5000,
  k62: 33.2000,
  k63: 15.9000,
  k64: 98.3000,
  k65: 81.0000,
  k66: 63.7000,
  k67: 46.4000,
  k68: 29.1000,
  k69: 11.8000,
  k70: 94.2000,
  k71: 76.9000,
} as const;

export function V1026_RHS_CARE_SCENARIO_124_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_124_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_124_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_124_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_124_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_124_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_124_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_124_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_124_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_124_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_124_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_124_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
