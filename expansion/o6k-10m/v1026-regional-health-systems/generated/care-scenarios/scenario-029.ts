import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 029 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_029_META = {
  id: 'stress_029',
  regionId: 'TAS' as V1026RhsRegionId,
  primaryChannel: 'remote' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'recovering' as V1026RhsHealthSystemBand,
  seed: 26940,
} as const;

const V1026_RHS_CARE_SCENARIO_029_COEF = {
  k0: 23.1000,
  k1: 25.2000,
  k2: 27.3000,
  k3: 29.4000,
  k4: 31.5000,
  k5: 33.6000,
  k6: 35.7000,
  k7: 37.8000,
  k8: 39.9000,
  k9: 42.0000,
  k10: 44.1000,
  k11: 46.2000,
  k12: 48.3000,
  k13: 50.4000,
  k14: 52.5000,
  k15: 54.6000,
  k16: 56.7000,
  k17: 58.8000,
  k18: 60.9000,
  k19: 63.0000,
  k20: 65.1000,
  k21: 67.2000,
  k22: 69.3000,
  k23: 71.4000,
  k24: 73.5000,
  k25: 75.6000,
  k26: 77.7000,
  k27: 79.8000,
  k28: 81.9000,
  k29: 84.0000,
  k30: 86.1000,
  k31: 88.2000,
  k32: 90.3000,
  k33: 92.4000,
  k34: 94.5000,
  k35: 96.6000,
  k36: 98.7000,
  k37: 1.1000,
  k38: 3.2000,
  k39: 5.3000,
  k40: 7.4000,
  k41: 9.5000,
  k42: 11.6000,
  k43: 13.7000,
  k44: 15.8000,
  k45: 17.9000,
  k46: 20.0000,
  k47: 22.1000,
  k48: 24.2000,
  k49: 26.3000,
  k50: 28.4000,
  k51: 30.5000,
  k52: 32.6000,
  k53: 34.7000,
  k54: 36.8000,
  k55: 38.9000,
  k56: 41.0000,
  k57: 43.1000,
  k58: 45.2000,
  k59: 47.3000,
  k60: 49.4000,
  k61: 51.5000,
  k62: 53.6000,
  k63: 55.7000,
  k64: 57.8000,
  k65: 59.9000,
  k66: 62.0000,
  k67: 64.1000,
  k68: 66.2000,
  k69: 68.3000,
  k70: 70.4000,
  k71: 72.5000,
} as const;

export function V1026_RHS_CARE_SCENARIO_029_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_029_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_029_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_029_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_029_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_029_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_029_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_029_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_029_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_029_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_029_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_029_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
