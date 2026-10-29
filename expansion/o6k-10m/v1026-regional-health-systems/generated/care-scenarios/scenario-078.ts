import { V1026_RHS_clamp, V1026_RHS_healthSystemBandFromScore } from '../../engine/regional-health-systems-utils.ts';
import type {
  V1026RhsHealthSystemBand,
  V1026RhsRegionId,
  V1026RhsCareSnapshot,
  V1026RhsHealthSystemChannel,
} from '../../types/core.ts';

/** Generated care scenario 078 — clinical/bed/primary-care handoff matrix. */
export const V1026_RHS_CARE_SCENARIO_078_META = {
  id: 'stress_078',
  regionId: 'NT' as V1026RhsRegionId,
  primaryChannel: 'regional' as V1026RhsHealthSystemChannel,
  healthSystemBand: 'critical' as V1026RhsHealthSystemBand,
  seed: 71579,
} as const;

const V1026_RHS_CARE_SCENARIO_078_COEF = {
  k0: 73.6000,
  k1: 53.1000,
  k2: 32.6000,
  k3: 12.1000,
  k4: 91.3000,
  k5: 70.8000,
  k6: 50.3000,
  k7: 29.8000,
  k8: 9.3000,
  k9: 88.5000,
  k10: 68.0000,
  k11: 47.5000,
  k12: 27.0000,
  k13: 6.5000,
  k14: 85.7000,
  k15: 65.2000,
  k16: 44.7000,
  k17: 24.2000,
  k18: 3.7000,
  k19: 82.9000,
  k20: 62.4000,
  k21: 41.9000,
  k22: 21.4000,
  k23: 0.9000,
  k24: 80.1000,
  k25: 59.6000,
  k26: 39.1000,
  k27: 18.6000,
  k28: 97.8000,
  k29: 77.3000,
  k30: 56.8000,
  k31: 36.3000,
  k32: 15.8000,
  k33: 95.0000,
  k34: 74.5000,
  k35: 54.0000,
  k36: 33.5000,
  k37: 13.0000,
  k38: 92.2000,
  k39: 71.7000,
  k40: 51.2000,
  k41: 30.7000,
  k42: 10.2000,
  k43: 89.4000,
  k44: 68.9000,
  k45: 48.4000,
  k46: 27.9000,
  k47: 7.4000,
  k48: 86.6000,
  k49: 66.1000,
  k50: 45.6000,
  k51: 25.1000,
  k52: 4.6000,
  k53: 83.8000,
  k54: 63.3000,
  k55: 42.8000,
  k56: 22.3000,
  k57: 1.8000,
  k58: 81.0000,
  k59: 60.5000,
  k60: 40.0000,
  k61: 19.5000,
  k62: 98.7000,
  k63: 78.2000,
  k64: 57.7000,
  k65: 37.2000,
  k66: 16.7000,
  k67: 95.9000,
  k68: 75.4000,
  k69: 54.9000,
  k70: 34.4000,
  k71: 13.9000,
} as const;

export function V1026_RHS_CARE_SCENARIO_078_evaluate(turn: number): {
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1026_RHS_CARE_SCENARIO_078_COEF) as Array<
    keyof typeof V1026_RHS_CARE_SCENARIO_078_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1026_RHS_CARE_SCENARIO_078_COEF[keys[j]] * ((turn + j) % 17);
  }
  const capacityStressIndex = V1026_RHS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const primaryCareAccessDelayTurns = V1026_RHS_clamp(2 + (acc % 11), 1, 18);
  const healthSystemScore = V1026_RHS_clamp(90 - capacityStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1026_RHS_healthSystemBandFromScore(healthSystemScore) !== 'overloaded';
  return { capacityStressIndex, primaryCareAccessDelayTurns, healthSystemScore, stable };
}

export function V1026_RHS_CARE_SCENARIO_078_snapshot(turn: number): V1026RhsCareSnapshot {
  const r = V1026_RHS_CARE_SCENARIO_078_evaluate(turn);
  return {
    scenarioId: V1026_RHS_CARE_SCENARIO_078_META.id,
    regionId: V1026_RHS_CARE_SCENARIO_078_META.regionId,
    healthSystemChannel: V1026_RHS_CARE_SCENARIO_078_META.primaryChannel,
    healthSystemBand: V1026_RHS_CARE_SCENARIO_078_META.healthSystemBand,
    capacityStressIndex: r.capacityStressIndex,
    primaryCareAccessDelayTurns: r.primaryCareAccessDelayTurns,
    healthSystemScore: r.healthSystemScore,
    healthSystemBand: V1026_RHS_healthSystemBandFromScore(r.healthSystemScore),
  };
}

export function V1026_RHS_CARE_SCENARIO_078_regressionAssert(turn: number): boolean {
  const r = V1026_RHS_CARE_SCENARIO_078_evaluate(turn);
  return typeof r.capacityStressIndex === 'number' && r.healthSystemScore <= 100;
}
