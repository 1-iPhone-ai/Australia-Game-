import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 083 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_083_META = {
  id: 'hazard_083',
  regionId: 'WA' as V1028DresRegionId,
  primaryChannel: 'telehealth' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'critical' as V1028DresResilienceBand,
  seed: 76134,
} as const;

const V1028_DRES_HAZARD_SCENARIO_083_COEF = {
  k0: 99.1000,
  k1: 35.6000,
  k2: 71.8000,
  k3: 8.3000,
  k4: 44.5000,
  k5: 80.7000,
  k6: 17.2000,
  k7: 53.4000,
  k8: 89.6000,
  k9: 26.1000,
  k10: 62.3000,
  k11: 98.5000,
  k12: 35.0000,
  k13: 71.2000,
  k14: 7.7000,
  k15: 43.9000,
  k16: 80.1000,
  k17: 16.6000,
  k18: 52.8000,
  k19: 89.0000,
  k20: 25.5000,
  k21: 61.7000,
  k22: 97.9000,
  k23: 34.4000,
  k24: 70.6000,
  k25: 7.1000,
  k26: 43.3000,
  k27: 79.5000,
  k28: 16.0000,
  k29: 52.2000,
  k30: 88.4000,
  k31: 24.9000,
  k32: 61.1000,
  k33: 97.3000,
  k34: 33.8000,
  k35: 70.0000,
  k36: 6.5000,
  k37: 42.7000,
  k38: 78.9000,
  k39: 15.4000,
  k40: 51.6000,
  k41: 87.8000,
  k42: 24.3000,
  k43: 60.5000,
  k44: 96.7000,
  k45: 33.2000,
  k46: 69.4000,
  k47: 5.9000,
  k48: 42.1000,
  k49: 78.3000,
  k50: 14.8000,
  k51: 51.0000,
  k52: 87.2000,
  k53: 23.7000,
  k54: 59.9000,
  k55: 96.1000,
  k56: 32.6000,
  k57: 68.8000,
  k58: 5.3000,
  k59: 41.5000,
  k60: 77.7000,
  k61: 14.2000,
  k62: 50.4000,
  k63: 86.6000,
  k64: 23.1000,
  k65: 59.3000,
  k66: 95.5000,
  k67: 32.0000,
  k68: 68.2000,
  k69: 4.7000,
  k70: 40.9000,
  k71: 77.1000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_083_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_083_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_083_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_083_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_083_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_083_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_083_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_083_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_083_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_083_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_083_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_083_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
