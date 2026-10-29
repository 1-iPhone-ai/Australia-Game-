import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 141 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_141_META = {
  id: 'stress_141',
  regionId: 'TAS' as V1026RhsRegionId,
  primaryChannel: 'primary_access' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'moderate' as V1026RhsHealthSystemBand,
  seed: 128972,
} as const;

const V1026_RHS_CARE_SCENARIO_141_COEF = {
  k0: 95.8000,
  k1: 32.0000,
  k2: 67.9000,
  k3: 4.1000,
  k4: 40.0000,
  k5: 75.9000,
  k6: 12.1000,
  k7: 48.0000,
  k8: 83.9000,
  k9: 20.1000,
  k10: 56.0000,
  k11: 91.9000,
  k12: 28.1000,
  k13: 64.0000,
  k14: 0.2000,
  k15: 36.1000,
  k16: 72.0000,
  k17: 8.2000,
  k18: 44.1000,
  k19: 80.0000,
  k20: 16.2000,
  k21: 52.1000,
  k22: 88.0000,
  k23: 24.2000,
  k24: 60.1000,
  k25: 96.0000,
  k26: 32.2000,
  k27: 68.1000,
  k28: 4.3000,
  k29: 40.2000,
  k30: 76.1000,
  k31: 12.3000,
  k32: 48.2000,
  k33: 84.1000,
  k34: 20.3000,
  k35: 56.2000,
  k36: 92.1000,
  k37: 28.3000,
  k38: 64.2000,
  k39: 0.4000,
  k40: 36.3000,
  k41: 72.2000,
  k42: 8.4000,
  k43: 44.3000,
  k44: 80.2000,
  k45: 16.4000,
  k46: 52.3000,
  k47: 88.2000,
  k48: 24.4000,
  k49: 60.3000,
  k50: 96.2000,
  k51: 32.4000,
  k52: 68.3000,
  k53: 4.5000,
  k54: 40.4000,
  k55: 76.3000,
  k56: 12.5000,
  k57: 48.4000,
  k58: 84.3000,
  k59: 20.5000,
  k60: 56.4000,
  k61: 92.3000,
  k62: 28.5000,
  k63: 64.4000,
  k64: 0.6000,
  k65: 36.5000,
  k66: 72.4000,
  k67: 8.6000,
  k68: 44.5000,
  k69: 80.4000,
  k70: 16.6000,
  k71: 52.5000,
} as const;

export function V1026_RHS_CARE_SCENARIO_141_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_141_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_141_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_141_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_141_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_141_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_141_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_141_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_141_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_141_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_141_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_141_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
