import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 138 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_138_META = {
  id: 'stress_138',
  regionId: 'QLD' as V1026RhsRegionId,
  primaryChannel: 'regional' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 126239,
} as const;

const V1026_RHS_CARE_SCENARIO_138_COEF = {
  k0: 80.5000,
  k1: 42.5000,
  k2: 4.5000,
  k3: 66.2000,
  k4: 28.2000,
  k5: 89.9000,
  k6: 51.9000,
  k7: 13.9000,
  k8: 75.6000,
  k9: 37.6000,
  k10: 99.3000,
  k11: 61.3000,
  k12: 23.3000,
  k13: 85.0000,
  k14: 47.0000,
  k15: 9.0000,
  k16: 70.7000,
  k17: 32.7000,
  k18: 94.4000,
  k19: 56.4000,
  k20: 18.4000,
  k21: 80.1000,
  k22: 42.1000,
  k23: 4.1000,
  k24: 65.8000,
  k25: 27.8000,
  k26: 89.5000,
  k27: 51.5000,
  k28: 13.5000,
  k29: 75.2000,
  k30: 37.2000,
  k31: 98.9000,
  k32: 60.9000,
  k33: 22.9000,
  k34: 84.6000,
  k35: 46.6000,
  k36: 8.6000,
  k37: 70.3000,
  k38: 32.3000,
  k39: 94.0000,
  k40: 56.0000,
  k41: 18.0000,
  k42: 79.7000,
  k43: 41.7000,
  k44: 3.7000,
  k45: 65.4000,
  k46: 27.4000,
  k47: 89.1000,
  k48: 51.1000,
  k49: 13.1000,
  k50: 74.8000,
  k51: 36.8000,
  k52: 98.5000,
  k53: 60.5000,
  k54: 22.5000,
  k55: 84.2000,
  k56: 46.2000,
  k57: 8.2000,
  k58: 69.9000,
  k59: 31.9000,
  k60: 93.6000,
  k61: 55.6000,
  k62: 17.6000,
  k63: 79.3000,
  k64: 41.3000,
  k65: 3.3000,
  k66: 65.0000,
  k67: 27.0000,
  k68: 88.7000,
  k69: 50.7000,
  k70: 12.7000,
  k71: 74.4000,
} as const;

export function V1026_RHS_CARE_SCENARIO_138_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_138_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_138_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_138_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_138_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_138_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_138_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_138_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_138_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_138_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_138_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_138_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
