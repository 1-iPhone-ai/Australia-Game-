import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 106 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_106_META = {
  id: 'hazard_106',
  regionId: 'QLD' as V1028DresRegionId,
  primaryChannel: 'aged_care' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'moderate' as V1028DresResilienceBand,
  seed: 97087,
} as const;

const V1028_DRES_HAZARD_SCENARIO_106_COEF = {
  k0: 17.0000,
  k1: 54.8000,
  k2: 92.6000,
  k3: 30.7000,
  k4: 68.5000,
  k5: 6.6000,
  k6: 44.4000,
  k7: 82.2000,
  k8: 20.3000,
  k9: 58.1000,
  k10: 95.9000,
  k11: 34.0000,
  k12: 71.8000,
  k13: 9.9000,
  k14: 47.7000,
  k15: 85.5000,
  k16: 23.6000,
  k17: 61.4000,
  k18: 99.2000,
  k19: 37.3000,
  k20: 75.1000,
  k21: 13.2000,
  k22: 51.0000,
  k23: 88.8000,
  k24: 26.9000,
  k25: 64.7000,
  k26: 2.8000,
  k27: 40.6000,
  k28: 78.4000,
  k29: 16.5000,
  k30: 54.3000,
  k31: 92.1000,
  k32: 30.2000,
  k33: 68.0000,
  k34: 6.1000,
  k35: 43.9000,
  k36: 81.7000,
  k37: 19.8000,
  k38: 57.6000,
  k39: 95.4000,
  k40: 33.5000,
  k41: 71.3000,
  k42: 9.4000,
  k43: 47.2000,
  k44: 85.0000,
  k45: 23.1000,
  k46: 60.9000,
  k47: 98.7000,
  k48: 36.8000,
  k49: 74.6000,
  k50: 12.7000,
  k51: 50.5000,
  k52: 88.3000,
  k53: 26.4000,
  k54: 64.2000,
  k55: 2.3000,
  k56: 40.1000,
  k57: 77.9000,
  k58: 16.0000,
  k59: 53.8000,
  k60: 91.6000,
  k61: 29.7000,
  k62: 67.5000,
  k63: 5.6000,
  k64: 43.4000,
  k65: 81.2000,
  k66: 19.3000,
  k67: 57.1000,
  k68: 94.9000,
  k69: 33.0000,
  k70: 70.8000,
  k71: 8.9000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_106_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_106_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_106_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_106_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_106_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_106_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_106_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_106_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_106_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_106_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_106_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_106_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
