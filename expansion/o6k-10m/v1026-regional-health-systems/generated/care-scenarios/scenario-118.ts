import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 118 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_118_META = {
  id: 'stress_118',
  regionId: 'NT' as V1026RhsRegionId,
  primaryChannel: 'regional' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 108019,
} as const;

const V1026_RHS_CARE_SCENARIO_118_COEF = {
  k0: 78.2000,
  k1: 12.8000,
  k2: 47.1000,
  k3: 81.4000,
  k4: 16.0000,
  k5: 50.3000,
  k6: 84.6000,
  k7: 19.2000,
  k8: 53.5000,
  k9: 87.8000,
  k10: 22.4000,
  k11: 56.7000,
  k12: 91.0000,
  k13: 25.6000,
  k14: 59.9000,
  k15: 94.2000,
  k16: 28.8000,
  k17: 63.1000,
  k18: 97.4000,
  k19: 32.0000,
  k20: 66.3000,
  k21: 0.9000,
  k22: 35.2000,
  k23: 69.5000,
  k24: 4.1000,
  k25: 38.4000,
  k26: 72.7000,
  k27: 7.3000,
  k28: 41.6000,
  k29: 75.9000,
  k30: 10.5000,
  k31: 44.8000,
  k32: 79.1000,
  k33: 13.7000,
  k34: 48.0000,
  k35: 82.3000,
  k36: 16.9000,
  k37: 51.2000,
  k38: 85.5000,
  k39: 20.1000,
  k40: 54.4000,
  k41: 88.7000,
  k42: 23.3000,
  k43: 57.6000,
  k44: 91.9000,
  k45: 26.5000,
  k46: 60.8000,
  k47: 95.1000,
  k48: 29.7000,
  k49: 64.0000,
  k50: 98.3000,
  k51: 32.9000,
  k52: 67.2000,
  k53: 1.8000,
  k54: 36.1000,
  k55: 70.4000,
  k56: 5.0000,
  k57: 39.3000,
  k58: 73.6000,
  k59: 8.2000,
  k60: 42.5000,
  k61: 76.8000,
  k62: 11.4000,
  k63: 45.7000,
  k64: 80.0000,
  k65: 14.6000,
  k66: 48.9000,
  k67: 83.2000,
  k68: 17.8000,
  k69: 52.1000,
  k70: 86.4000,
  k71: 21.0000,
} as const;

export function V1026_RHS_CARE_SCENARIO_118_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_118_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_118_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_118_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_118_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_118_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_118_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_118_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_118_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_118_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_118_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_118_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
