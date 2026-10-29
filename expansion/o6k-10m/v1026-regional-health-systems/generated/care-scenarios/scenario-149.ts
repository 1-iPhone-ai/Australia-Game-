import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 149 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_149_META = {
  id: 'stress_149',
  regionId: 'TAS' as V1026RhsRegionId,
  primaryChannel: 'remote' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'recovering' as V1026RhsHealthSystemBand,
  seed: 136260,
} as const;

const V1026_RHS_CARE_SCENARIO_149_COEF = {
  k0: 36.9000,
  k1: 4.0000,
  k2: 70.8000,
  k3: 37.9000,
  k4: 5.0000,
  k5: 71.8000,
  k6: 38.9000,
  k7: 6.0000,
  k8: 72.8000,
  k9: 39.9000,
  k10: 7.0000,
  k11: 73.8000,
  k12: 40.9000,
  k13: 8.0000,
  k14: 74.8000,
  k15: 41.9000,
  k16: 9.0000,
  k17: 75.8000,
  k18: 42.9000,
  k19: 10.0000,
  k20: 76.8000,
  k21: 43.9000,
  k22: 11.0000,
  k23: 77.8000,
  k24: 44.9000,
  k25: 12.0000,
  k26: 78.8000,
  k27: 45.9000,
  k28: 13.0000,
  k29: 79.8000,
  k30: 46.9000,
  k31: 14.0000,
  k32: 80.8000,
  k33: 47.9000,
  k34: 15.0000,
  k35: 81.8000,
  k36: 48.9000,
  k37: 16.0000,
  k38: 82.8000,
  k39: 49.9000,
  k40: 17.0000,
  k41: 83.8000,
  k42: 50.9000,
  k43: 18.0000,
  k44: 84.8000,
  k45: 51.9000,
  k46: 19.0000,
  k47: 85.8000,
  k48: 52.9000,
  k49: 20.0000,
  k50: 86.8000,
  k51: 53.9000,
  k52: 21.0000,
  k53: 87.8000,
  k54: 54.9000,
  k55: 22.0000,
  k56: 88.8000,
  k57: 55.9000,
  k58: 23.0000,
  k59: 89.8000,
  k60: 56.9000,
  k61: 24.0000,
  k62: 90.8000,
  k63: 57.9000,
  k64: 25.0000,
  k65: 91.8000,
  k66: 58.9000,
  k67: 26.0000,
  k68: 92.8000,
  k69: 59.9000,
  k70: 27.0000,
  k71: 93.8000,
} as const;

export function V1026_RHS_CARE_SCENARIO_149_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_149_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_149_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_149_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_149_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_149_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_149_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_149_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_149_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_149_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_149_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_149_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
