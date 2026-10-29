import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 147 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_147_META = {
  id: 'stress_147',
  regionId: 'WA' as V1026RhsRegionId,
  primaryChannel: 'mental_health' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 134438,
} as const;

const V1026_RHS_CARE_SCENARIO_147_COEF = {
  k0: 26.7000,
  k1: 11.0000,
  k2: 95.0000,
  k3: 79.3000,
  k4: 63.6000,
  k5: 47.9000,
  k6: 32.2000,
  k7: 16.5000,
  k8: 0.8000,
  k9: 84.8000,
  k10: 69.1000,
  k11: 53.4000,
  k12: 37.7000,
  k13: 22.0000,
  k14: 6.3000,
  k15: 90.3000,
  k16: 74.6000,
  k17: 58.9000,
  k18: 43.2000,
  k19: 27.5000,
  k20: 11.8000,
  k21: 95.8000,
  k22: 80.1000,
  k23: 64.4000,
  k24: 48.7000,
  k25: 33.0000,
  k26: 17.3000,
  k27: 1.6000,
  k28: 85.6000,
  k29: 69.9000,
  k30: 54.2000,
  k31: 38.5000,
  k32: 22.8000,
  k33: 7.1000,
  k34: 91.1000,
  k35: 75.4000,
  k36: 59.7000,
  k37: 44.0000,
  k38: 28.3000,
  k39: 12.6000,
  k40: 96.6000,
  k41: 80.9000,
  k42: 65.2000,
  k43: 49.5000,
  k44: 33.8000,
  k45: 18.1000,
  k46: 2.4000,
  k47: 86.4000,
  k48: 70.7000,
  k49: 55.0000,
  k50: 39.3000,
  k51: 23.6000,
  k52: 7.9000,
  k53: 91.9000,
  k54: 76.2000,
  k55: 60.5000,
  k56: 44.8000,
  k57: 29.1000,
  k58: 13.4000,
  k59: 97.4000,
  k60: 81.7000,
  k61: 66.0000,
  k62: 50.3000,
  k63: 34.6000,
  k64: 18.9000,
  k65: 3.2000,
  k66: 87.2000,
  k67: 71.5000,
  k68: 55.8000,
  k69: 40.1000,
  k70: 24.4000,
  k71: 8.7000,
} as const;

export function V1026_RHS_CARE_SCENARIO_147_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_147_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_147_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_147_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_147_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_147_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_147_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_147_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_147_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_147_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_147_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_147_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
