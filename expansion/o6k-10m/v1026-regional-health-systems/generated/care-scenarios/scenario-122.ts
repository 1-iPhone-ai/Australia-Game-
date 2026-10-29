import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 122 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_122_META = {
  id: 'stress_122',
  regionId: 'QLD' as V1026RhsRegionId,
  primaryChannel: 'hospital_network' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'elevated' as V1026RhsHealthSystemBand,
  seed: 111663,
} as const;

const V1026_RHS_CARE_SCENARIO_122_COEF = {
  k0: 98.6000,
  k1: 98.5000,
  k2: 98.4000,
  k3: 98.3000,
  k4: 98.2000,
  k5: 98.1000,
  k6: 98.0000,
  k7: 97.9000,
  k8: 97.8000,
  k9: 97.7000,
  k10: 97.6000,
  k11: 97.5000,
  k12: 97.4000,
  k13: 97.3000,
  k14: 97.2000,
  k15: 97.1000,
  k16: 97.0000,
  k17: 96.9000,
  k18: 96.8000,
  k19: 96.7000,
  k20: 96.6000,
  k21: 96.5000,
  k22: 96.4000,
  k23: 96.3000,
  k24: 96.2000,
  k25: 96.1000,
  k26: 96.0000,
  k27: 95.9000,
  k28: 95.8000,
  k29: 95.7000,
  k30: 95.6000,
  k31: 95.5000,
  k32: 95.4000,
  k33: 95.3000,
  k34: 95.2000,
  k35: 95.1000,
  k36: 95.0000,
  k37: 94.9000,
  k38: 94.8000,
  k39: 94.7000,
  k40: 94.6000,
  k41: 94.5000,
  k42: 94.4000,
  k43: 94.3000,
  k44: 94.2000,
  k45: 94.1000,
  k46: 94.0000,
  k47: 93.9000,
  k48: 93.8000,
  k49: 93.7000,
  k50: 93.6000,
  k51: 93.5000,
  k52: 93.4000,
  k53: 93.3000,
  k54: 93.2000,
  k55: 93.1000,
  k56: 93.0000,
  k57: 92.9000,
  k58: 92.8000,
  k59: 92.7000,
  k60: 92.6000,
  k61: 92.5000,
  k62: 92.4000,
  k63: 92.3000,
  k64: 92.2000,
  k65: 92.1000,
  k66: 92.0000,
  k67: 91.9000,
  k68: 91.8000,
  k69: 91.7000,
  k70: 91.6000,
  k71: 91.5000,
} as const;

export function V1026_RHS_CARE_SCENARIO_122_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_122_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_122_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_122_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_122_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_122_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_122_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_122_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_122_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_122_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_122_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_122_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
