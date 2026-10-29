import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 032 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_032_META = {
  id: 'stress_032',
  regionId: 'NSW' as V1026RhsRegionId,
  primaryChannel: 'hospital_network' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 29673,
} as const;

const V1026_RHS_CARE_SCENARIO_032_COEF = {
  k0: 38.4000,
  k1: 14.7000,
  k2: 90.7000,
  k3: 67.0000,
  k4: 43.3000,
  k5: 19.6000,
  k6: 95.6000,
  k7: 71.9000,
  k8: 48.2000,
  k9: 24.5000,
  k10: 0.8000,
  k11: 76.8000,
  k12: 53.1000,
  k13: 29.4000,
  k14: 5.7000,
  k15: 81.7000,
  k16: 58.0000,
  k17: 34.3000,
  k18: 10.6000,
  k19: 86.6000,
  k20: 62.9000,
  k21: 39.2000,
  k22: 15.5000,
  k23: 91.5000,
  k24: 67.8000,
  k25: 44.1000,
  k26: 20.4000,
  k27: 96.4000,
  k28: 72.7000,
  k29: 49.0000,
  k30: 25.3000,
  k31: 1.6000,
  k32: 77.6000,
  k33: 53.9000,
  k34: 30.2000,
  k35: 6.5000,
  k36: 82.5000,
  k37: 58.8000,
  k38: 35.1000,
  k39: 11.4000,
  k40: 87.4000,
  k41: 63.7000,
  k42: 40.0000,
  k43: 16.3000,
  k44: 92.3000,
  k45: 68.6000,
  k46: 44.9000,
  k47: 21.2000,
  k48: 97.2000,
  k49: 73.5000,
  k50: 49.8000,
  k51: 26.1000,
  k52: 2.4000,
  k53: 78.4000,
  k54: 54.7000,
  k55: 31.0000,
  k56: 7.3000,
  k57: 83.3000,
  k58: 59.6000,
  k59: 35.9000,
  k60: 12.2000,
  k61: 88.2000,
  k62: 64.5000,
  k63: 40.8000,
  k64: 17.1000,
  k65: 93.1000,
  k66: 69.4000,
  k67: 45.7000,
  k68: 22.0000,
  k69: 98.0000,
  k70: 74.3000,
  k71: 50.6000,
} as const;

export function V1026_RHS_CARE_SCENARIO_032_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_032_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_032_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_032_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_032_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_032_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_032_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_032_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_032_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_032_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_032_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_032_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
