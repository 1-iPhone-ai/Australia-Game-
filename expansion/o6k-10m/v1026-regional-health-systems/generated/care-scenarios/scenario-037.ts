import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 037 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_037_META = {
  id: 'stress_037',
  regionId: 'TAS' as V1026RhsRegionId,
  primaryChannel: 'mental_health' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 34228,
} as const;

const V1026_RHS_CARE_SCENARIO_037_COEF = {
  k0: 63.9000,
  k1: 96.9000,
  k2: 30.2000,
  k3: 63.2000,
  k4: 96.2000,
  k5: 29.5000,
  k6: 62.5000,
  k7: 95.5000,
  k8: 28.8000,
  k9: 61.8000,
  k10: 94.8000,
  k11: 28.1000,
  k12: 61.1000,
  k13: 94.1000,
  k14: 27.4000,
  k15: 60.4000,
  k16: 93.4000,
  k17: 26.7000,
  k18: 59.7000,
  k19: 92.7000,
  k20: 26.0000,
  k21: 59.0000,
  k22: 92.0000,
  k23: 25.3000,
  k24: 58.3000,
  k25: 91.3000,
  k26: 24.6000,
  k27: 57.6000,
  k28: 90.6000,
  k29: 23.9000,
  k30: 56.9000,
  k31: 89.9000,
  k32: 23.2000,
  k33: 56.2000,
  k34: 89.2000,
  k35: 22.5000,
  k36: 55.5000,
  k37: 88.5000,
  k38: 21.8000,
  k39: 54.8000,
  k40: 87.8000,
  k41: 21.1000,
  k42: 54.1000,
  k43: 87.1000,
  k44: 20.4000,
  k45: 53.4000,
  k46: 86.4000,
  k47: 19.7000,
  k48: 52.7000,
  k49: 85.7000,
  k50: 19.0000,
  k51: 52.0000,
  k52: 85.0000,
  k53: 18.3000,
  k54: 51.3000,
  k55: 84.3000,
  k56: 17.6000,
  k57: 50.6000,
  k58: 83.6000,
  k59: 16.9000,
  k60: 49.9000,
  k61: 82.9000,
  k62: 16.2000,
  k63: 49.2000,
  k64: 82.2000,
  k65: 15.5000,
  k66: 48.5000,
  k67: 81.5000,
  k68: 14.8000,
  k69: 47.8000,
  k70: 80.8000,
  k71: 14.1000,
} as const;

export function V1026_RHS_CARE_SCENARIO_037_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_037_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_037_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_037_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_037_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_037_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_037_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_037_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_037_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_037_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_037_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_037_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
