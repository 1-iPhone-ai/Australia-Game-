import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 116 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_116_META = {
  id: 'hazard_116',
  regionId: 'SA' as V1028DresRegionId,
  primaryChannel: 'aged_care' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'moderate' as V1028DresResilienceBand,
  seed: 106197,
} as const;

const V1028_DRES_HAZARD_SCENARIO_116_COEF = {
  k0: 68.0000,
  k1: 19.8000,
  k2: 71.3000,
  k3: 23.1000,
  k4: 74.6000,
  k5: 26.4000,
  k6: 77.9000,
  k7: 29.7000,
  k8: 81.2000,
  k9: 33.0000,
  k10: 84.5000,
  k11: 36.3000,
  k12: 87.8000,
  k13: 39.6000,
  k14: 91.1000,
  k15: 42.9000,
  k16: 94.4000,
  k17: 46.2000,
  k18: 97.7000,
  k19: 49.5000,
  k20: 1.3000,
  k21: 52.8000,
  k22: 4.6000,
  k23: 56.1000,
  k24: 7.9000,
  k25: 59.4000,
  k26: 11.2000,
  k27: 62.7000,
  k28: 14.5000,
  k29: 66.0000,
  k30: 17.8000,
  k31: 69.3000,
  k32: 21.1000,
  k33: 72.6000,
  k34: 24.4000,
  k35: 75.9000,
  k36: 27.7000,
  k37: 79.2000,
  k38: 31.0000,
  k39: 82.5000,
  k40: 34.3000,
  k41: 85.8000,
  k42: 37.6000,
  k43: 89.1000,
  k44: 40.9000,
  k45: 92.4000,
  k46: 44.2000,
  k47: 95.7000,
  k48: 47.5000,
  k49: 99.0000,
  k50: 50.8000,
  k51: 2.6000,
  k52: 54.1000,
  k53: 5.9000,
  k54: 57.4000,
  k55: 9.2000,
  k56: 60.7000,
  k57: 12.5000,
  k58: 64.0000,
  k59: 15.8000,
  k60: 67.3000,
  k61: 19.1000,
  k62: 70.6000,
  k63: 22.4000,
  k64: 73.9000,
  k65: 25.7000,
  k66: 77.2000,
  k67: 29.0000,
  k68: 80.5000,
  k69: 32.3000,
  k70: 83.8000,
  k71: 35.6000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_116_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_116_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_116_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_116_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_116_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_116_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_116_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_116_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_116_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_116_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_116_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_116_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
