import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 009 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_009_META = {
  id: 'hazard_009',
  regionId: 'VIC' as V1028DresRegionId,
  primaryChannel: 'remote' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'recovering' as V1028DresResilienceBand,
  seed: 8720,
} as const;

const V1028_DRES_HAZARD_SCENARIO_009_COEF = {
  k0: 20.8000,
  k1: 95.2000,
  k2: 69.9000,
  k3: 44.6000,
  k4: 19.3000,
  k5: 93.7000,
  k6: 68.4000,
  k7: 43.1000,
  k8: 17.8000,
  k9: 92.2000,
  k10: 66.9000,
  k11: 41.6000,
  k12: 16.3000,
  k13: 90.7000,
  k14: 65.4000,
  k15: 40.1000,
  k16: 14.8000,
  k17: 89.2000,
  k18: 63.9000,
  k19: 38.6000,
  k20: 13.3000,
  k21: 87.7000,
  k22: 62.4000,
  k23: 37.1000,
  k24: 11.8000,
  k25: 86.2000,
  k26: 60.9000,
  k27: 35.6000,
  k28: 10.3000,
  k29: 84.7000,
  k30: 59.4000,
  k31: 34.1000,
  k32: 8.8000,
  k33: 83.2000,
  k34: 57.9000,
  k35: 32.6000,
  k36: 7.3000,
  k37: 81.7000,
  k38: 56.4000,
  k39: 31.1000,
  k40: 5.8000,
  k41: 80.2000,
  k42: 54.9000,
  k43: 29.6000,
  k44: 4.3000,
  k45: 78.7000,
  k46: 53.4000,
  k47: 28.1000,
  k48: 2.8000,
  k49: 77.2000,
  k50: 51.9000,
  k51: 26.6000,
  k52: 1.3000,
  k53: 75.7000,
  k54: 50.4000,
  k55: 25.1000,
  k56: 99.5000,
  k57: 74.2000,
  k58: 48.9000,
  k59: 23.6000,
  k60: 98.0000,
  k61: 72.7000,
  k62: 47.4000,
  k63: 22.1000,
  k64: 96.5000,
  k65: 71.2000,
  k66: 45.9000,
  k67: 20.6000,
  k68: 95.0000,
  k69: 69.7000,
  k70: 44.4000,
  k71: 19.1000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_009_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_009_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_009_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_009_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_009_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_009_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_009_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_009_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_009_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_009_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_009_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_009_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
