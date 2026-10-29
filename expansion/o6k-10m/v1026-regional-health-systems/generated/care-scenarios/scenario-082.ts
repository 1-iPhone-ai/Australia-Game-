import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 082 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_082_META = {
  id: 'stress_082',
  regionId: 'QLD' as V1026RhsRegionId,
  primaryChannel: 'hospital_network' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 75223,
} as const;

const V1026_RHS_CARE_SCENARIO_082_COEF = {
  k0: 94.0000,
  k1: 39.1000,
  k2: 83.9000,
  k3: 29.0000,
  k4: 73.8000,
  k5: 18.9000,
  k6: 63.7000,
  k7: 8.8000,
  k8: 53.6000,
  k9: 98.4000,
  k10: 43.5000,
  k11: 88.3000,
  k12: 33.4000,
  k13: 78.2000,
  k14: 23.3000,
  k15: 68.1000,
  k16: 13.2000,
  k17: 58.0000,
  k18: 3.1000,
  k19: 47.9000,
  k20: 92.7000,
  k21: 37.8000,
  k22: 82.6000,
  k23: 27.7000,
  k24: 72.5000,
  k25: 17.6000,
  k26: 62.4000,
  k27: 7.5000,
  k28: 52.3000,
  k29: 97.1000,
  k30: 42.2000,
  k31: 87.0000,
  k32: 32.1000,
  k33: 76.9000,
  k34: 22.0000,
  k35: 66.8000,
  k36: 11.9000,
  k37: 56.7000,
  k38: 1.8000,
  k39: 46.6000,
  k40: 91.4000,
  k41: 36.5000,
  k42: 81.3000,
  k43: 26.4000,
  k44: 71.2000,
  k45: 16.3000,
  k46: 61.1000,
  k47: 6.2000,
  k48: 51.0000,
  k49: 95.8000,
  k50: 40.9000,
  k51: 85.7000,
  k52: 30.8000,
  k53: 75.6000,
  k54: 20.7000,
  k55: 65.5000,
  k56: 10.6000,
  k57: 55.4000,
  k58: 0.5000,
  k59: 45.3000,
  k60: 90.1000,
  k61: 35.2000,
  k62: 80.0000,
  k63: 25.1000,
  k64: 69.9000,
  k65: 15.0000,
  k66: 59.8000,
  k67: 4.9000,
  k68: 49.7000,
  k69: 94.5000,
  k70: 39.6000,
  k71: 84.4000,
} as const;

export function V1026_RHS_CARE_SCENARIO_082_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_082_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_082_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_082_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_082_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_082_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_082_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_082_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_082_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_082_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_082_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_082_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
