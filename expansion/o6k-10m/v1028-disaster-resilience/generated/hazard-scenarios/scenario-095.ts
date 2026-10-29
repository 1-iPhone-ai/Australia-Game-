import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 095 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_095_META = {
  id: 'hazard_095',
  regionId: 'ACT' as V1028DresRegionId,
  primaryChannel: 'specialist_referral' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'minimal' as V1028DresResilienceBand,
  seed: 87066,
} as const;

const V1028_DRES_HAZARD_SCENARIO_095_COEF = {
  k0: 60.6000,
  k1: 93.3000,
  k2: 26.3000,
  k3: 59.0000,
  k4: 91.7000,
  k5: 24.7000,
  k6: 57.4000,
  k7: 90.1000,
  k8: 23.1000,
  k9: 55.8000,
  k10: 88.5000,
  k11: 21.5000,
  k12: 54.2000,
  k13: 86.9000,
  k14: 19.9000,
  k15: 52.6000,
  k16: 85.3000,
  k17: 18.3000,
  k18: 51.0000,
  k19: 83.7000,
  k20: 16.7000,
  k21: 49.4000,
  k22: 82.1000,
  k23: 15.1000,
  k24: 47.8000,
  k25: 80.5000,
  k26: 13.5000,
  k27: 46.2000,
  k28: 78.9000,
  k29: 11.9000,
  k30: 44.6000,
  k31: 77.3000,
  k32: 10.3000,
  k33: 43.0000,
  k34: 75.7000,
  k35: 8.7000,
  k36: 41.4000,
  k37: 74.1000,
  k38: 7.1000,
  k39: 39.8000,
  k40: 72.5000,
  k41: 5.5000,
  k42: 38.2000,
  k43: 70.9000,
  k44: 3.9000,
  k45: 36.6000,
  k46: 69.3000,
  k47: 2.3000,
  k48: 35.0000,
  k49: 67.7000,
  k50: 0.7000,
  k51: 33.4000,
  k52: 66.1000,
  k53: 98.8000,
  k54: 31.8000,
  k55: 64.5000,
  k56: 97.2000,
  k57: 30.2000,
  k58: 62.9000,
  k59: 95.6000,
  k60: 28.6000,
  k61: 61.3000,
  k62: 94.0000,
  k63: 27.0000,
  k64: 59.7000,
  k65: 92.4000,
  k66: 25.4000,
  k67: 58.1000,
  k68: 90.8000,
  k69: 23.8000,
  k70: 56.5000,
  k71: 89.2000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_095_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_095_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_095_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_095_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_095_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_095_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_095_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_095_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_095_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_095_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_095_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_095_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
