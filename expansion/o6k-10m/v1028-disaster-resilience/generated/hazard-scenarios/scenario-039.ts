import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 039 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_039_META = {
  id: 'hazard_039',
  regionId: 'ACT' as V1028DresRegionId,
  primaryChannel: 'remote' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'recovering' as V1028DresResilienceBand,
  seed: 36050,
} as const;

const V1028_DRES_HAZARD_SCENARIO_039_COEF = {
  k0: 74.1000,
  k1: 89.9000,
  k2: 6.0000,
  k3: 21.8000,
  k4: 37.6000,
  k5: 53.4000,
  k6: 69.2000,
  k7: 85.0000,
  k8: 1.1000,
  k9: 16.9000,
  k10: 32.7000,
  k11: 48.5000,
  k12: 64.3000,
  k13: 80.1000,
  k14: 95.9000,
  k15: 12.0000,
  k16: 27.8000,
  k17: 43.6000,
  k18: 59.4000,
  k19: 75.2000,
  k20: 91.0000,
  k21: 7.1000,
  k22: 22.9000,
  k23: 38.7000,
  k24: 54.5000,
  k25: 70.3000,
  k26: 86.1000,
  k27: 2.2000,
  k28: 18.0000,
  k29: 33.8000,
  k30: 49.6000,
  k31: 65.4000,
  k32: 81.2000,
  k33: 97.0000,
  k34: 13.1000,
  k35: 28.9000,
  k36: 44.7000,
  k37: 60.5000,
  k38: 76.3000,
  k39: 92.1000,
  k40: 8.2000,
  k41: 24.0000,
  k42: 39.8000,
  k43: 55.6000,
  k44: 71.4000,
  k45: 87.2000,
  k46: 3.3000,
  k47: 19.1000,
  k48: 34.9000,
  k49: 50.7000,
  k50: 66.5000,
  k51: 82.3000,
  k52: 98.1000,
  k53: 14.2000,
  k54: 30.0000,
  k55: 45.8000,
  k56: 61.6000,
  k57: 77.4000,
  k58: 93.2000,
  k59: 9.3000,
  k60: 25.1000,
  k61: 40.9000,
  k62: 56.7000,
  k63: 72.5000,
  k64: 88.3000,
  k65: 4.4000,
  k66: 20.2000,
  k67: 36.0000,
  k68: 51.8000,
  k69: 67.6000,
  k70: 83.4000,
  k71: 99.2000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_039_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_039_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_039_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_039_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_039_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_039_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_039_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_039_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_039_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_039_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_039_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_039_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
