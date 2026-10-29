import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 079 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_079_META = {
  id: 'hazard_079',
  regionId: 'ACT' as V1028DresRegionId,
  primaryChannel: 'remote' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'recovering' as V1028DresResilienceBand,
  seed: 72490,
} as const;

const V1028_DRES_HAZARD_SCENARIO_079_COEF = {
  k0: 78.7000,
  k1: 49.6000,
  k2: 20.5000,
  k3: 91.1000,
  k4: 62.0000,
  k5: 32.9000,
  k6: 3.8000,
  k7: 74.4000,
  k8: 45.3000,
  k9: 16.2000,
  k10: 86.8000,
  k11: 57.7000,
  k12: 28.6000,
  k13: 99.2000,
  k14: 70.1000,
  k15: 41.0000,
  k16: 11.9000,
  k17: 82.5000,
  k18: 53.4000,
  k19: 24.3000,
  k20: 94.9000,
  k21: 65.8000,
  k22: 36.7000,
  k23: 7.6000,
  k24: 78.2000,
  k25: 49.1000,
  k26: 20.0000,
  k27: 90.6000,
  k28: 61.5000,
  k29: 32.4000,
  k30: 3.3000,
  k31: 73.9000,
  k32: 44.8000,
  k33: 15.7000,
  k34: 86.3000,
  k35: 57.2000,
  k36: 28.1000,
  k37: 98.7000,
  k38: 69.6000,
  k39: 40.5000,
  k40: 11.4000,
  k41: 82.0000,
  k42: 52.9000,
  k43: 23.8000,
  k44: 94.4000,
  k45: 65.3000,
  k46: 36.2000,
  k47: 7.1000,
  k48: 77.7000,
  k49: 48.6000,
  k50: 19.5000,
  k51: 90.1000,
  k52: 61.0000,
  k53: 31.9000,
  k54: 2.8000,
  k55: 73.4000,
  k56: 44.3000,
  k57: 15.2000,
  k58: 85.8000,
  k59: 56.7000,
  k60: 27.6000,
  k61: 98.2000,
  k62: 69.1000,
  k63: 40.0000,
  k64: 10.9000,
  k65: 81.5000,
  k66: 52.4000,
  k67: 23.3000,
  k68: 93.9000,
  k69: 64.8000,
  k70: 35.7000,
  k71: 6.6000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_079_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_079_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_079_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_079_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_079_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_079_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_079_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_079_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_079_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_079_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_079_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_079_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
