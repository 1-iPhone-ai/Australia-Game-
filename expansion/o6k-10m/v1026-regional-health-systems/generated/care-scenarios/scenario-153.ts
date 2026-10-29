import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 153 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_153_META = {
  id: 'stress_153',
  regionId: 'VIC' as V1026RhsRegionId,
  primaryChannel: 'telehealth' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 139904,
} as const;

const V1026_RHS_CARE_SCENARIO_153_COEF = {
  k0: 57.3000,
  k1: 89.7000,
  k2: 22.4000,
  k3: 54.8000,
  k4: 87.2000,
  k5: 19.9000,
  k6: 52.3000,
  k7: 84.7000,
  k8: 17.4000,
  k9: 49.8000,
  k10: 82.2000,
  k11: 14.9000,
  k12: 47.3000,
  k13: 79.7000,
  k14: 12.4000,
  k15: 44.8000,
  k16: 77.2000,
  k17: 9.9000,
  k18: 42.3000,
  k19: 74.7000,
  k20: 7.4000,
  k21: 39.8000,
  k22: 72.2000,
  k23: 4.9000,
  k24: 37.3000,
  k25: 69.7000,
  k26: 2.4000,
  k27: 34.8000,
  k28: 67.2000,
  k29: 99.6000,
  k30: 32.3000,
  k31: 64.7000,
  k32: 97.1000,
  k33: 29.8000,
  k34: 62.2000,
  k35: 94.6000,
  k36: 27.3000,
  k37: 59.7000,
  k38: 92.1000,
  k39: 24.8000,
  k40: 57.2000,
  k41: 89.6000,
  k42: 22.3000,
  k43: 54.7000,
  k44: 87.1000,
  k45: 19.8000,
  k46: 52.2000,
  k47: 84.6000,
  k48: 17.3000,
  k49: 49.7000,
  k50: 82.1000,
  k51: 14.8000,
  k52: 47.2000,
  k53: 79.6000,
  k54: 12.3000,
  k55: 44.7000,
  k56: 77.1000,
  k57: 9.8000,
  k58: 42.2000,
  k59: 74.6000,
  k60: 7.3000,
  k61: 39.7000,
  k62: 72.1000,
  k63: 4.8000,
  k64: 37.2000,
  k65: 69.6000,
  k66: 2.3000,
  k67: 34.7000,
  k68: 67.1000,
  k69: 99.5000,
  k70: 32.2000,
  k71: 64.6000,
} as const;

export function V1026_RHS_CARE_SCENARIO_153_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_153_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_153_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_153_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_153_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_153_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_153_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_153_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_153_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_153_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_153_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_153_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
