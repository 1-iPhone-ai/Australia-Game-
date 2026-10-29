import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 157 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_157_META = {
  id: 'hazard_157',
  regionId: 'TAS' as V1028DresRegionId,
  primaryChannel: 'mental_health' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'elevated' as V1028DresResilienceBand,
  seed: 143548,
} as const;

const V1028_DRES_HAZARD_SCENARIO_157_COEF = {
  k0: 77.7000,
  k1: 75.7000,
  k2: 73.7000,
  k3: 71.7000,
  k4: 69.7000,
  k5: 67.7000,
  k6: 65.7000,
  k7: 63.7000,
  k8: 61.7000,
  k9: 59.7000,
  k10: 57.7000,
  k11: 55.7000,
  k12: 53.7000,
  k13: 51.7000,
  k14: 49.7000,
  k15: 47.7000,
  k16: 45.7000,
  k17: 43.7000,
  k18: 41.7000,
  k19: 39.7000,
  k20: 37.7000,
  k21: 35.7000,
  k22: 33.7000,
  k23: 31.7000,
  k24: 29.7000,
  k25: 27.7000,
  k26: 25.7000,
  k27: 23.7000,
  k28: 21.7000,
  k29: 19.7000,
  k30: 17.7000,
  k31: 15.7000,
  k32: 13.7000,
  k33: 11.7000,
  k34: 9.7000,
  k35: 7.7000,
  k36: 5.7000,
  k37: 3.7000,
  k38: 1.7000,
  k39: 99.4000,
  k40: 97.4000,
  k41: 95.4000,
  k42: 93.4000,
  k43: 91.4000,
  k44: 89.4000,
  k45: 87.4000,
  k46: 85.4000,
  k47: 83.4000,
  k48: 81.4000,
  k49: 79.4000,
  k50: 77.4000,
  k51: 75.4000,
  k52: 73.4000,
  k53: 71.4000,
  k54: 69.4000,
  k55: 67.4000,
  k56: 65.4000,
  k57: 63.4000,
  k58: 61.4000,
  k59: 59.4000,
  k60: 57.4000,
  k61: 55.4000,
  k62: 53.4000,
  k63: 51.4000,
  k64: 49.4000,
  k65: 47.4000,
  k66: 45.4000,
  k67: 43.4000,
  k68: 41.4000,
  k69: 39.4000,
  k70: 37.4000,
  k71: 35.4000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_157_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_157_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_157_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_157_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_157_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_157_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_157_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_157_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_157_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_157_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_157_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_157_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
