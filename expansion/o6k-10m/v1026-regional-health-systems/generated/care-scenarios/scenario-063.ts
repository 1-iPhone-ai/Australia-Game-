import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 063 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_063_META = {
  id: 'stress_063',
  regionId: 'ACT' as V1026RhsRegionId,
  primaryChannel: 'telehealth' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 57914,
} as const;

const V1026_RHS_CARE_SCENARIO_063_COEF = {
  k0: 96.8000,
  k1: 5.9000,
  k2: 14.7000,
  k3: 23.5000,
  k4: 32.3000,
  k5: 41.1000,
  k6: 49.9000,
  k7: 58.7000,
  k8: 67.5000,
  k9: 76.3000,
  k10: 85.1000,
  k11: 93.9000,
  k12: 3.0000,
  k13: 11.8000,
  k14: 20.6000,
  k15: 29.4000,
  k16: 38.2000,
  k17: 47.0000,
  k18: 55.8000,
  k19: 64.6000,
  k20: 73.4000,
  k21: 82.2000,
  k22: 91.0000,
  k23: 0.1000,
  k24: 8.9000,
  k25: 17.7000,
  k26: 26.5000,
  k27: 35.3000,
  k28: 44.1000,
  k29: 52.9000,
  k30: 61.7000,
  k31: 70.5000,
  k32: 79.3000,
  k33: 88.1000,
  k34: 96.9000,
  k35: 6.0000,
  k36: 14.8000,
  k37: 23.6000,
  k38: 32.4000,
  k39: 41.2000,
  k40: 50.0000,
  k41: 58.8000,
  k42: 67.6000,
  k43: 76.4000,
  k44: 85.2000,
  k45: 94.0000,
  k46: 3.1000,
  k47: 11.9000,
  k48: 20.7000,
  k49: 29.5000,
  k50: 38.3000,
  k51: 47.1000,
  k52: 55.9000,
  k53: 64.7000,
  k54: 73.5000,
  k55: 82.3000,
  k56: 91.1000,
  k57: 0.2000,
  k58: 9.0000,
  k59: 17.8000,
  k60: 26.6000,
  k61: 35.4000,
  k62: 44.2000,
  k63: 53.0000,
  k64: 61.8000,
  k65: 70.6000,
  k66: 79.4000,
  k67: 88.2000,
  k68: 97.0000,
  k69: 6.1000,
  k70: 14.9000,
  k71: 23.7000,
} as const;

export function V1026_RHS_CARE_SCENARIO_063_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_063_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_063_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_063_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_063_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_063_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_063_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_063_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_063_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_063_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_063_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_063_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
