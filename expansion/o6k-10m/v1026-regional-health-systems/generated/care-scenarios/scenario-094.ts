import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 094 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_094_META = {
  id: 'stress_094',
  regionId: 'NT' as V1026RhsRegionId,
  primaryChannel: 'rural_clinic' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'recovering' as V1026RhsHealthSystemBand,
  seed: 86155,
} as const;

const V1026_RHS_CARE_SCENARIO_094_COEF = {
  k0: 55.5000,
  k1: 96.8000,
  k2: 38.4000,
  k3: 79.7000,
  k4: 21.3000,
  k5: 62.6000,
  k6: 4.2000,
  k7: 45.5000,
  k8: 86.8000,
  k9: 28.4000,
  k10: 69.7000,
  k11: 11.3000,
  k12: 52.6000,
  k13: 93.9000,
  k14: 35.5000,
  k15: 76.8000,
  k16: 18.4000,
  k17: 59.7000,
  k18: 1.3000,
  k19: 42.6000,
  k20: 83.9000,
  k21: 25.5000,
  k22: 66.8000,
  k23: 8.4000,
  k24: 49.7000,
  k25: 91.0000,
  k26: 32.6000,
  k27: 73.9000,
  k28: 15.5000,
  k29: 56.8000,
  k30: 98.1000,
  k31: 39.7000,
  k32: 81.0000,
  k33: 22.6000,
  k34: 63.9000,
  k35: 5.5000,
  k36: 46.8000,
  k37: 88.1000,
  k38: 29.7000,
  k39: 71.0000,
  k40: 12.6000,
  k41: 53.9000,
  k42: 95.2000,
  k43: 36.8000,
  k44: 78.1000,
  k45: 19.7000,
  k46: 61.0000,
  k47: 2.6000,
  k48: 43.9000,
  k49: 85.2000,
  k50: 26.8000,
  k51: 68.1000,
  k52: 9.7000,
  k53: 51.0000,
  k54: 92.3000,
  k55: 33.9000,
  k56: 75.2000,
  k57: 16.8000,
  k58: 58.1000,
  k59: 99.4000,
  k60: 41.0000,
  k61: 82.3000,
  k62: 23.9000,
  k63: 65.2000,
  k64: 6.8000,
  k65: 48.1000,
  k66: 89.4000,
  k67: 31.0000,
  k68: 72.3000,
  k69: 13.9000,
  k70: 55.2000,
  k71: 96.5000,
} as const;

export function V1026_RHS_CARE_SCENARIO_094_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_094_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_094_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_094_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_094_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_094_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_094_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_094_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_094_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_094_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_094_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_094_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
