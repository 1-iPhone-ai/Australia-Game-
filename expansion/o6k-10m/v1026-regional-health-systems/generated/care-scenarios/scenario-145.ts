import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 145 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_145_META = {
  id: 'stress_145',
  regionId: 'VIC' as V1026RhsRegionId,
  primaryChannel: 'specialist_referral' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'minimal' as V1026RhsHealthSystemBand,
  seed: 132616,
} as const;

const V1026_RHS_CARE_SCENARIO_145_COEF = {
  k0: 16.5000,
  k1: 18.0000,
  k2: 19.5000,
  k3: 21.0000,
  k4: 22.5000,
  k5: 24.0000,
  k6: 25.5000,
  k7: 27.0000,
  k8: 28.5000,
  k9: 30.0000,
  k10: 31.5000,
  k11: 33.0000,
  k12: 34.5000,
  k13: 36.0000,
  k14: 37.5000,
  k15: 39.0000,
  k16: 40.5000,
  k17: 42.0000,
  k18: 43.5000,
  k19: 45.0000,
  k20: 46.5000,
  k21: 48.0000,
  k22: 49.5000,
  k23: 51.0000,
  k24: 52.5000,
  k25: 54.0000,
  k26: 55.5000,
  k27: 57.0000,
  k28: 58.5000,
  k29: 60.0000,
  k30: 61.5000,
  k31: 63.0000,
  k32: 64.5000,
  k33: 66.0000,
  k34: 67.5000,
  k35: 69.0000,
  k36: 70.5000,
  k37: 72.0000,
  k38: 73.5000,
  k39: 75.0000,
  k40: 76.5000,
  k41: 78.0000,
  k42: 79.5000,
  k43: 81.0000,
  k44: 82.5000,
  k45: 84.0000,
  k46: 85.5000,
  k47: 87.0000,
  k48: 88.5000,
  k49: 90.0000,
  k50: 91.5000,
  k51: 93.0000,
  k52: 94.5000,
  k53: 96.0000,
  k54: 97.5000,
  k55: 99.0000,
  k56: 0.8000,
  k57: 2.3000,
  k58: 3.8000,
  k59: 5.3000,
  k60: 6.8000,
  k61: 8.3000,
  k62: 9.8000,
  k63: 11.3000,
  k64: 12.8000,
  k65: 14.3000,
  k66: 15.8000,
  k67: 17.3000,
  k68: 18.8000,
  k69: 20.3000,
  k70: 21.8000,
  k71: 23.3000,
} as const;

export function V1026_RHS_CARE_SCENARIO_145_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_145_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_145_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_145_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_145_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_145_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_145_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_145_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_145_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_145_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_145_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_145_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
