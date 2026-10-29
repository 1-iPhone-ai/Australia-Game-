import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 061 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_061_META = {
  id: 'stress_061',
  regionId: 'TAS' as V1026RhsRegionId,
  primaryChannel: 'primary_access' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'moderate' as V1026RhsHealthSystemBand,
  seed: 56092,
} as const;

const V1026_RHS_CARE_SCENARIO_061_COEF = {
  k0: 86.6000,
  k1: 12.9000,
  k2: 38.9000,
  k3: 64.9000,
  k4: 90.9000,
  k5: 17.2000,
  k6: 43.2000,
  k7: 69.2000,
  k8: 95.2000,
  k9: 21.5000,
  k10: 47.5000,
  k11: 73.5000,
  k12: 99.5000,
  k13: 25.8000,
  k14: 51.8000,
  k15: 77.8000,
  k16: 4.1000,
  k17: 30.1000,
  k18: 56.1000,
  k19: 82.1000,
  k20: 8.4000,
  k21: 34.4000,
  k22: 60.4000,
  k23: 86.4000,
  k24: 12.7000,
  k25: 38.7000,
  k26: 64.7000,
  k27: 90.7000,
  k28: 17.0000,
  k29: 43.0000,
  k30: 69.0000,
  k31: 95.0000,
  k32: 21.3000,
  k33: 47.3000,
  k34: 73.3000,
  k35: 99.3000,
  k36: 25.6000,
  k37: 51.6000,
  k38: 77.6000,
  k39: 3.9000,
  k40: 29.9000,
  k41: 55.9000,
  k42: 81.9000,
  k43: 8.2000,
  k44: 34.2000,
  k45: 60.2000,
  k46: 86.2000,
  k47: 12.5000,
  k48: 38.5000,
  k49: 64.5000,
  k50: 90.5000,
  k51: 16.8000,
  k52: 42.8000,
  k53: 68.8000,
  k54: 94.8000,
  k55: 21.1000,
  k56: 47.1000,
  k57: 73.1000,
  k58: 99.1000,
  k59: 25.4000,
  k60: 51.4000,
  k61: 77.4000,
  k62: 3.7000,
  k63: 29.7000,
  k64: 55.7000,
  k65: 81.7000,
  k66: 8.0000,
  k67: 34.0000,
  k68: 60.0000,
  k69: 86.0000,
  k70: 12.3000,
  k71: 38.3000,
} as const;

export function V1026_RHS_CARE_SCENARIO_061_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_061_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_061_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_061_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_061_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_061_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_061_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_061_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_061_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_061_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_061_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_061_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
