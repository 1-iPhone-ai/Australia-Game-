import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 125 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_125_META = {
  id: 'hazard_125',
  regionId: 'TAS' as V1028DresRegionId,
  primaryChannel: 'specialist_referral' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'minimal' as V1028DresResilienceBand,
  seed: 114396,
} as const;

const V1028_DRES_HAZARD_SCENARIO_125_COEF = {
  k0: 14.2000,
  k1: 88.0000,
  k2: 62.1000,
  k3: 36.2000,
  k4: 10.3000,
  k5: 84.1000,
  k6: 58.2000,
  k7: 32.3000,
  k8: 6.4000,
  k9: 80.2000,
  k10: 54.3000,
  k11: 28.4000,
  k12: 2.5000,
  k13: 76.3000,
  k14: 50.4000,
  k15: 24.5000,
  k16: 98.3000,
  k17: 72.4000,
  k18: 46.5000,
  k19: 20.6000,
  k20: 94.4000,
  k21: 68.5000,
  k22: 42.6000,
  k23: 16.7000,
  k24: 90.5000,
  k25: 64.6000,
  k26: 38.7000,
  k27: 12.8000,
  k28: 86.6000,
  k29: 60.7000,
  k30: 34.8000,
  k31: 8.9000,
  k32: 82.7000,
  k33: 56.8000,
  k34: 30.9000,
  k35: 5.0000,
  k36: 78.8000,
  k37: 52.9000,
  k38: 27.0000,
  k39: 1.1000,
  k40: 74.9000,
  k41: 49.0000,
  k42: 23.1000,
  k43: 96.9000,
  k44: 71.0000,
  k45: 45.1000,
  k46: 19.2000,
  k47: 93.0000,
  k48: 67.1000,
  k49: 41.2000,
  k50: 15.3000,
  k51: 89.1000,
  k52: 63.2000,
  k53: 37.3000,
  k54: 11.4000,
  k55: 85.2000,
  k56: 59.3000,
  k57: 33.4000,
  k58: 7.5000,
  k59: 81.3000,
  k60: 55.4000,
  k61: 29.5000,
  k62: 3.6000,
  k63: 77.4000,
  k64: 51.5000,
  k65: 25.6000,
  k66: 99.4000,
  k67: 73.5000,
  k68: 47.6000,
  k69: 21.7000,
  k70: 95.5000,
  k71: 69.6000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_125_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_125_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_125_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_125_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_125_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_125_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_125_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_125_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_125_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_125_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_125_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_125_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
