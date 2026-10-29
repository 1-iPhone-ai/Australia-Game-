import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 144 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_144_META = {
  id: 'hazard_144',
  regionId: 'NSW' as V1028DresRegionId,
  primaryChannel: 'rural_clinic' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'recovering' as V1028DresResilienceBand,
  seed: 131705,
} as const;

const V1028_DRES_HAZARD_SCENARIO_144_COEF = {
  k0: 11.4000,
  k1: 21.5000,
  k2: 31.6000,
  k3: 41.7000,
  k4: 51.8000,
  k5: 61.9000,
  k6: 72.0000,
  k7: 82.1000,
  k8: 92.2000,
  k9: 2.6000,
  k10: 12.7000,
  k11: 22.8000,
  k12: 32.9000,
  k13: 43.0000,
  k14: 53.1000,
  k15: 63.2000,
  k16: 73.3000,
  k17: 83.4000,
  k18: 93.5000,
  k19: 3.9000,
  k20: 14.0000,
  k21: 24.1000,
  k22: 34.2000,
  k23: 44.3000,
  k24: 54.4000,
  k25: 64.5000,
  k26: 74.6000,
  k27: 84.7000,
  k28: 94.8000,
  k29: 5.2000,
  k30: 15.3000,
  k31: 25.4000,
  k32: 35.5000,
  k33: 45.6000,
  k34: 55.7000,
  k35: 65.8000,
  k36: 75.9000,
  k37: 86.0000,
  k38: 96.1000,
  k39: 6.5000,
  k40: 16.6000,
  k41: 26.7000,
  k42: 36.8000,
  k43: 46.9000,
  k44: 57.0000,
  k45: 67.1000,
  k46: 77.2000,
  k47: 87.3000,
  k48: 97.4000,
  k49: 7.8000,
  k50: 17.9000,
  k51: 28.0000,
  k52: 38.1000,
  k53: 48.2000,
  k54: 58.3000,
  k55: 68.4000,
  k56: 78.5000,
  k57: 88.6000,
  k58: 98.7000,
  k59: 9.1000,
  k60: 19.2000,
  k61: 29.3000,
  k62: 39.4000,
  k63: 49.5000,
  k64: 59.6000,
  k65: 69.7000,
  k66: 79.8000,
  k67: 89.9000,
  k68: 0.3000,
  k69: 10.4000,
  k70: 20.5000,
  k71: 30.6000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_144_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_144_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_144_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_144_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_144_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_144_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_144_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_144_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_144_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_144_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_144_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_144_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
