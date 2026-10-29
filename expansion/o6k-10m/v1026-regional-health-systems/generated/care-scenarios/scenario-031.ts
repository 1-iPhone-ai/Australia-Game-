import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 031 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_031_META = {
  id: 'stress_031',
  regionId: 'ACT' as V1026RhsRegionId,
  primaryChannel: 'primary_access' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'moderate' as V1026RhsHealthSystemBand,
  seed: 28762,
} as const;

const V1026_RHS_CARE_SCENARIO_031_COEF = {
  k0: 33.3000,
  k1: 18.2000,
  k2: 3.1000,
  k3: 87.7000,
  k4: 72.6000,
  k5: 57.5000,
  k6: 42.4000,
  k7: 27.3000,
  k8: 12.2000,
  k9: 96.8000,
  k10: 81.7000,
  k11: 66.6000,
  k12: 51.5000,
  k13: 36.4000,
  k14: 21.3000,
  k15: 6.2000,
  k16: 90.8000,
  k17: 75.7000,
  k18: 60.6000,
  k19: 45.5000,
  k20: 30.4000,
  k21: 15.3000,
  k22: 0.2000,
  k23: 84.8000,
  k24: 69.7000,
  k25: 54.6000,
  k26: 39.5000,
  k27: 24.4000,
  k28: 9.3000,
  k29: 93.9000,
  k30: 78.8000,
  k31: 63.7000,
  k32: 48.6000,
  k33: 33.5000,
  k34: 18.4000,
  k35: 3.3000,
  k36: 87.9000,
  k37: 72.8000,
  k38: 57.7000,
  k39: 42.6000,
  k40: 27.5000,
  k41: 12.4000,
  k42: 97.0000,
  k43: 81.9000,
  k44: 66.8000,
  k45: 51.7000,
  k46: 36.6000,
  k47: 21.5000,
  k48: 6.4000,
  k49: 91.0000,
  k50: 75.9000,
  k51: 60.8000,
  k52: 45.7000,
  k53: 30.6000,
  k54: 15.5000,
  k55: 0.4000,
  k56: 85.0000,
  k57: 69.9000,
  k58: 54.8000,
  k59: 39.7000,
  k60: 24.6000,
  k61: 9.5000,
  k62: 94.1000,
  k63: 79.0000,
  k64: 63.9000,
  k65: 48.8000,
  k66: 33.7000,
  k67: 18.6000,
  k68: 3.5000,
  k69: 88.1000,
  k70: 73.0000,
  k71: 57.9000,
} as const;

export function V1026_RHS_CARE_SCENARIO_031_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_031_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_031_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_031_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_031_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_031_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_031_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_031_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_031_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_031_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_031_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_031_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
