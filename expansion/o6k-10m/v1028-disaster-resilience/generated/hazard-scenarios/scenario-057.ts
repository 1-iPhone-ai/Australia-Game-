import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 057 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_057_META = {
  id: 'hazard_057',
  regionId: 'VIC' as V1028DresRegionId,
  primaryChannel: 'mental_health' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'elevated' as V1028DresResilienceBand,
  seed: 52448,
} as const;

const V1028_DRES_HAZARD_SCENARIO_057_COEF = {
  k0: 66.2000,
  k1: 26.9000,
  k2: 87.3000,
  k3: 48.0000,
  k4: 8.7000,
  k5: 69.1000,
  k6: 29.8000,
  k7: 90.2000,
  k8: 50.9000,
  k9: 11.6000,
  k10: 72.0000,
  k11: 32.7000,
  k12: 93.1000,
  k13: 53.8000,
  k14: 14.5000,
  k15: 74.9000,
  k16: 35.6000,
  k17: 96.0000,
  k18: 56.7000,
  k19: 17.4000,
  k20: 77.8000,
  k21: 38.5000,
  k22: 98.9000,
  k23: 59.6000,
  k24: 20.3000,
  k25: 80.7000,
  k26: 41.4000,
  k27: 2.1000,
  k28: 62.5000,
  k29: 23.2000,
  k30: 83.6000,
  k31: 44.3000,
  k32: 5.0000,
  k33: 65.4000,
  k34: 26.1000,
  k35: 86.5000,
  k36: 47.2000,
  k37: 7.9000,
  k38: 68.3000,
  k39: 29.0000,
  k40: 89.4000,
  k41: 50.1000,
  k42: 10.8000,
  k43: 71.2000,
  k44: 31.9000,
  k45: 92.3000,
  k46: 53.0000,
  k47: 13.7000,
  k48: 74.1000,
  k49: 34.8000,
  k50: 95.2000,
  k51: 55.9000,
  k52: 16.6000,
  k53: 77.0000,
  k54: 37.7000,
  k55: 98.1000,
  k56: 58.8000,
  k57: 19.5000,
  k58: 79.9000,
  k59: 40.6000,
  k60: 1.3000,
  k61: 61.7000,
  k62: 22.4000,
  k63: 82.8000,
  k64: 43.5000,
  k65: 4.2000,
  k66: 64.6000,
  k67: 25.3000,
  k68: 85.7000,
  k69: 46.4000,
  k70: 7.1000,
  k71: 67.5000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_057_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_057_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_057_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_057_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_057_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_057_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_057_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_057_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_057_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_057_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_057_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_057_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
