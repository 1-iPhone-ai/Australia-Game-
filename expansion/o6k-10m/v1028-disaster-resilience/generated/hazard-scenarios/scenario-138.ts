import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 138 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_138_META = {
  id: 'hazard_138',
  regionId: 'QLD' as V1028DresRegionId,
  primaryChannel: 'regional' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'critical' as V1028DresResilienceBand,
  seed: 126239,
} as const;

const V1028_DRES_HAZARD_SCENARIO_138_COEF = {
  k0: 80.5000,
  k1: 42.5000,
  k2: 4.5000,
  k3: 66.2000,
  k4: 28.2000,
  k5: 89.9000,
  k6: 51.9000,
  k7: 13.9000,
  k8: 75.6000,
  k9: 37.6000,
  k10: 99.3000,
  k11: 61.3000,
  k12: 23.3000,
  k13: 85.0000,
  k14: 47.0000,
  k15: 9.0000,
  k16: 70.7000,
  k17: 32.7000,
  k18: 94.4000,
  k19: 56.4000,
  k20: 18.4000,
  k21: 80.1000,
  k22: 42.1000,
  k23: 4.1000,
  k24: 65.8000,
  k25: 27.8000,
  k26: 89.5000,
  k27: 51.5000,
  k28: 13.5000,
  k29: 75.2000,
  k30: 37.2000,
  k31: 98.9000,
  k32: 60.9000,
  k33: 22.9000,
  k34: 84.6000,
  k35: 46.6000,
  k36: 8.6000,
  k37: 70.3000,
  k38: 32.3000,
  k39: 94.0000,
  k40: 56.0000,
  k41: 18.0000,
  k42: 79.7000,
  k43: 41.7000,
  k44: 3.7000,
  k45: 65.4000,
  k46: 27.4000,
  k47: 89.1000,
  k48: 51.1000,
  k49: 13.1000,
  k50: 74.8000,
  k51: 36.8000,
  k52: 98.5000,
  k53: 60.5000,
  k54: 22.5000,
  k55: 84.2000,
  k56: 46.2000,
  k57: 8.2000,
  k58: 69.9000,
  k59: 31.9000,
  k60: 93.6000,
  k61: 55.6000,
  k62: 17.6000,
  k63: 79.3000,
  k64: 41.3000,
  k65: 3.3000,
  k66: 65.0000,
  k67: 27.0000,
  k68: 88.7000,
  k69: 50.7000,
  k70: 12.7000,
  k71: 74.4000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_138_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_138_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_138_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_138_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_138_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_138_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_138_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_138_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_138_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_138_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_138_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_138_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
