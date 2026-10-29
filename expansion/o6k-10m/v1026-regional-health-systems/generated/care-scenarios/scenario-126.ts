import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 126 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_126_META = {
  id: 'stress_126',
  regionId: 'NT' as V1026RhsRegionId,
  primaryChannel: 'aged_care' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'moderate' as V1026RhsHealthSystemBand,
  seed: 115307,
} as const;

const V1026_RHS_CARE_SCENARIO_126_COEF = {
  k0: 19.3000,
  k1: 84.5000,
  k2: 50.0000,
  k3: 15.5000,
  k4: 80.7000,
  k5: 46.2000,
  k6: 11.7000,
  k7: 76.9000,
  k8: 42.4000,
  k9: 7.9000,
  k10: 73.1000,
  k11: 38.6000,
  k12: 4.1000,
  k13: 69.3000,
  k14: 34.8000,
  k15: 0.3000,
  k16: 65.5000,
  k17: 31.0000,
  k18: 96.2000,
  k19: 61.7000,
  k20: 27.2000,
  k21: 92.4000,
  k22: 57.9000,
  k23: 23.4000,
  k24: 88.6000,
  k25: 54.1000,
  k26: 19.6000,
  k27: 84.8000,
  k28: 50.3000,
  k29: 15.8000,
  k30: 81.0000,
  k31: 46.5000,
  k32: 12.0000,
  k33: 77.2000,
  k34: 42.7000,
  k35: 8.2000,
  k36: 73.4000,
  k37: 38.9000,
  k38: 4.4000,
  k39: 69.6000,
  k40: 35.1000,
  k41: 0.6000,
  k42: 65.8000,
  k43: 31.3000,
  k44: 96.5000,
  k45: 62.0000,
  k46: 27.5000,
  k47: 92.7000,
  k48: 58.2000,
  k49: 23.7000,
  k50: 88.9000,
  k51: 54.4000,
  k52: 19.9000,
  k53: 85.1000,
  k54: 50.6000,
  k55: 16.1000,
  k56: 81.3000,
  k57: 46.8000,
  k58: 12.3000,
  k59: 77.5000,
  k60: 43.0000,
  k61: 8.5000,
  k62: 73.7000,
  k63: 39.2000,
  k64: 4.7000,
  k65: 69.9000,
  k66: 35.4000,
  k67: 0.9000,
  k68: 66.1000,
  k69: 31.6000,
  k70: 96.8000,
  k71: 62.3000,
} as const;

export function V1026_RHS_CARE_SCENARIO_126_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_126_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_126_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_126_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_126_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_126_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_126_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_126_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_126_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_126_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_126_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_126_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
