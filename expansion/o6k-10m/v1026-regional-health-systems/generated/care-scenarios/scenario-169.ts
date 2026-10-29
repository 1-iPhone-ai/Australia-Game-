import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 169 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_169_META = {
  id: 'stress_169',
  regionId: 'VIC' as V1026RhsRegionId,
  primaryChannel: 'remote' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'recovering' as V1026RhsHealthSystemBand,
  seed: 154480,
} as const;

const V1026_RHS_CARE_SCENARIO_169_COEF = {
  k0: 39.2000,
  k1: 33.7000,
  k2: 28.2000,
  k3: 22.7000,
  k4: 17.2000,
  k5: 11.7000,
  k6: 6.2000,
  k7: 0.7000,
  k8: 94.9000,
  k9: 89.4000,
  k10: 83.9000,
  k11: 78.4000,
  k12: 72.9000,
  k13: 67.4000,
  k14: 61.9000,
  k15: 56.4000,
  k16: 50.9000,
  k17: 45.4000,
  k18: 39.9000,
  k19: 34.4000,
  k20: 28.9000,
  k21: 23.4000,
  k22: 17.9000,
  k23: 12.4000,
  k24: 6.9000,
  k25: 1.4000,
  k26: 95.6000,
  k27: 90.1000,
  k28: 84.6000,
  k29: 79.1000,
  k30: 73.6000,
  k31: 68.1000,
  k32: 62.6000,
  k33: 57.1000,
  k34: 51.6000,
  k35: 46.1000,
  k36: 40.6000,
  k37: 35.1000,
  k38: 29.6000,
  k39: 24.1000,
  k40: 18.6000,
  k41: 13.1000,
  k42: 7.6000,
  k43: 2.1000,
  k44: 96.3000,
  k45: 90.8000,
  k46: 85.3000,
  k47: 79.8000,
  k48: 74.3000,
  k49: 68.8000,
  k50: 63.3000,
  k51: 57.8000,
  k52: 52.3000,
  k53: 46.8000,
  k54: 41.3000,
  k55: 35.8000,
  k56: 30.3000,
  k57: 24.8000,
  k58: 19.3000,
  k59: 13.8000,
  k60: 8.3000,
  k61: 2.8000,
  k62: 97.0000,
  k63: 91.5000,
  k64: 86.0000,
  k65: 80.5000,
  k66: 75.0000,
  k67: 69.5000,
  k68: 64.0000,
  k69: 58.5000,
  k70: 53.0000,
  k71: 47.5000,
} as const;

export function V1026_RHS_CARE_SCENARIO_169_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_169_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_169_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_169_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_169_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_169_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_169_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_169_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_169_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_169_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_169_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_169_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
