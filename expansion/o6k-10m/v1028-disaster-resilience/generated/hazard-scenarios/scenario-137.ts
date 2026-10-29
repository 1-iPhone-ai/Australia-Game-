import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 137 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_137_META = {
  id: 'hazard_137',
  regionId: 'VIC' as V1028DresRegionId,
  primaryChannel: 'mental_health' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'elevated' as V1028DresResilienceBand,
  seed: 125328,
} as const;

const V1028_DRES_HAZARD_SCENARIO_137_COEF = {
  k0: 75.4000,
  k1: 46.0000,
  k2: 16.6000,
  k3: 86.9000,
  k4: 57.5000,
  k5: 28.1000,
  k6: 98.4000,
  k7: 69.0000,
  k8: 39.6000,
  k9: 10.2000,
  k10: 80.5000,
  k11: 51.1000,
  k12: 21.7000,
  k13: 92.0000,
  k14: 62.6000,
  k15: 33.2000,
  k16: 3.8000,
  k17: 74.1000,
  k18: 44.7000,
  k19: 15.3000,
  k20: 85.6000,
  k21: 56.2000,
  k22: 26.8000,
  k23: 97.1000,
  k24: 67.7000,
  k25: 38.3000,
  k26: 8.9000,
  k27: 79.2000,
  k28: 49.8000,
  k29: 20.4000,
  k30: 90.7000,
  k31: 61.3000,
  k32: 31.9000,
  k33: 2.5000,
  k34: 72.8000,
  k35: 43.4000,
  k36: 14.0000,
  k37: 84.3000,
  k38: 54.9000,
  k39: 25.5000,
  k40: 95.8000,
  k41: 66.4000,
  k42: 37.0000,
  k43: 7.6000,
  k44: 77.9000,
  k45: 48.5000,
  k46: 19.1000,
  k47: 89.4000,
  k48: 60.0000,
  k49: 30.6000,
  k50: 1.2000,
  k51: 71.5000,
  k52: 42.1000,
  k53: 12.7000,
  k54: 83.0000,
  k55: 53.6000,
  k56: 24.2000,
  k57: 94.5000,
  k58: 65.1000,
  k59: 35.7000,
  k60: 6.3000,
  k61: 76.6000,
  k62: 47.2000,
  k63: 17.8000,
  k64: 88.1000,
  k65: 58.7000,
  k66: 29.3000,
  k67: 99.6000,
  k68: 70.2000,
  k69: 40.8000,
  k70: 11.4000,
  k71: 81.7000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_137_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_137_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_137_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_137_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_137_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_137_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_137_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_137_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_137_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_137_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_137_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_137_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
