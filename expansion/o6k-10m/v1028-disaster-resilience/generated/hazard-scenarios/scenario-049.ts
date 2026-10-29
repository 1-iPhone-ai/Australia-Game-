import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 049 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_049_META = {
  id: 'hazard_049',
  regionId: 'VIC' as V1028DresRegionId,
  primaryChannel: 'remote' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'recovering' as V1028DresResilienceBand,
  seed: 45160,
} as const;

const V1028_DRES_HAZARD_SCENARIO_049_COEF = {
  k0: 25.4000,
  k1: 54.9000,
  k2: 84.4000,
  k3: 14.2000,
  k4: 43.7000,
  k5: 73.2000,
  k6: 3.0000,
  k7: 32.5000,
  k8: 62.0000,
  k9: 91.5000,
  k10: 21.3000,
  k11: 50.8000,
  k12: 80.3000,
  k13: 10.1000,
  k14: 39.6000,
  k15: 69.1000,
  k16: 98.6000,
  k17: 28.4000,
  k18: 57.9000,
  k19: 87.4000,
  k20: 17.2000,
  k21: 46.7000,
  k22: 76.2000,
  k23: 6.0000,
  k24: 35.5000,
  k25: 65.0000,
  k26: 94.5000,
  k27: 24.3000,
  k28: 53.8000,
  k29: 83.3000,
  k30: 13.1000,
  k31: 42.6000,
  k32: 72.1000,
  k33: 1.9000,
  k34: 31.4000,
  k35: 60.9000,
  k36: 90.4000,
  k37: 20.2000,
  k38: 49.7000,
  k39: 79.2000,
  k40: 9.0000,
  k41: 38.5000,
  k42: 68.0000,
  k43: 97.5000,
  k44: 27.3000,
  k45: 56.8000,
  k46: 86.3000,
  k47: 16.1000,
  k48: 45.6000,
  k49: 75.1000,
  k50: 4.9000,
  k51: 34.4000,
  k52: 63.9000,
  k53: 93.4000,
  k54: 23.2000,
  k55: 52.7000,
  k56: 82.2000,
  k57: 12.0000,
  k58: 41.5000,
  k59: 71.0000,
  k60: 0.8000,
  k61: 30.3000,
  k62: 59.8000,
  k63: 89.3000,
  k64: 19.1000,
  k65: 48.6000,
  k66: 78.1000,
  k67: 7.9000,
  k68: 37.4000,
  k69: 66.9000,
  k70: 96.4000,
  k71: 26.2000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_049_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_049_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_049_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_049_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_049_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_049_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_049_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_049_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_049_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_049_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_049_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_049_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
