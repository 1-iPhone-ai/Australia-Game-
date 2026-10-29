import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 062 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_062_META = {
  id: 'stress_062',
  regionId: 'NT' as V1026RhsRegionId,
  primaryChannel: 'hospital_network' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 57003,
} as const;

const V1026_RHS_CARE_SCENARIO_062_COEF = {
  k0: 91.7000,
  k1: 9.4000,
  k2: 26.8000,
  k3: 44.2000,
  k4: 61.6000,
  k5: 79.0000,
  k6: 96.4000,
  k7: 14.1000,
  k8: 31.5000,
  k9: 48.9000,
  k10: 66.3000,
  k11: 83.7000,
  k12: 1.4000,
  k13: 18.8000,
  k14: 36.2000,
  k15: 53.6000,
  k16: 71.0000,
  k17: 88.4000,
  k18: 6.1000,
  k19: 23.5000,
  k20: 40.9000,
  k21: 58.3000,
  k22: 75.7000,
  k23: 93.1000,
  k24: 10.8000,
  k25: 28.2000,
  k26: 45.6000,
  k27: 63.0000,
  k28: 80.4000,
  k29: 97.8000,
  k30: 15.5000,
  k31: 32.9000,
  k32: 50.3000,
  k33: 67.7000,
  k34: 85.1000,
  k35: 2.8000,
  k36: 20.2000,
  k37: 37.6000,
  k38: 55.0000,
  k39: 72.4000,
  k40: 89.8000,
  k41: 7.5000,
  k42: 24.9000,
  k43: 42.3000,
  k44: 59.7000,
  k45: 77.1000,
  k46: 94.5000,
  k47: 12.2000,
  k48: 29.6000,
  k49: 47.0000,
  k50: 64.4000,
  k51: 81.8000,
  k52: 99.2000,
  k53: 16.9000,
  k54: 34.3000,
  k55: 51.7000,
  k56: 69.1000,
  k57: 86.5000,
  k58: 4.2000,
  k59: 21.6000,
  k60: 39.0000,
  k61: 56.4000,
  k62: 73.8000,
  k63: 91.2000,
  k64: 8.9000,
  k65: 26.3000,
  k66: 43.7000,
  k67: 61.1000,
  k68: 78.5000,
  k69: 95.9000,
  k70: 13.6000,
  k71: 31.0000,
} as const;

export function V1026_RHS_CARE_SCENARIO_062_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_062_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_062_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_062_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_062_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_062_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_062_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_062_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_062_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_062_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_062_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_062_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
