import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 015 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_015_META = {
  id: 'hazard_015',
  regionId: 'ACT' as V1028DresRegionId,
  primaryChannel: 'specialist_referral' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'minimal' as V1028DresResilienceBand,
  seed: 14186,
} as const;

const V1028_DRES_HAZARD_SCENARIO_015_COEF = {
  k0: 51.4000,
  k1: 74.2000,
  k2: 97.0000,
  k3: 20.1000,
  k4: 42.9000,
  k5: 65.7000,
  k6: 88.5000,
  k7: 11.6000,
  k8: 34.4000,
  k9: 57.2000,
  k10: 80.0000,
  k11: 3.1000,
  k12: 25.9000,
  k13: 48.7000,
  k14: 71.5000,
  k15: 94.3000,
  k16: 17.4000,
  k17: 40.2000,
  k18: 63.0000,
  k19: 85.8000,
  k20: 8.9000,
  k21: 31.7000,
  k22: 54.5000,
  k23: 77.3000,
  k24: 0.4000,
  k25: 23.2000,
  k26: 46.0000,
  k27: 68.8000,
  k28: 91.6000,
  k29: 14.7000,
  k30: 37.5000,
  k31: 60.3000,
  k32: 83.1000,
  k33: 6.2000,
  k34: 29.0000,
  k35: 51.8000,
  k36: 74.6000,
  k37: 97.4000,
  k38: 20.5000,
  k39: 43.3000,
  k40: 66.1000,
  k41: 88.9000,
  k42: 12.0000,
  k43: 34.8000,
  k44: 57.6000,
  k45: 80.4000,
  k46: 3.5000,
  k47: 26.3000,
  k48: 49.1000,
  k49: 71.9000,
  k50: 94.7000,
  k51: 17.8000,
  k52: 40.6000,
  k53: 63.4000,
  k54: 86.2000,
  k55: 9.3000,
  k56: 32.1000,
  k57: 54.9000,
  k58: 77.7000,
  k59: 0.8000,
  k60: 23.6000,
  k61: 46.4000,
  k62: 69.2000,
  k63: 92.0000,
  k64: 15.1000,
  k65: 37.9000,
  k66: 60.7000,
  k67: 83.5000,
  k68: 6.6000,
  k69: 29.4000,
  k70: 52.2000,
  k71: 75.0000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_015_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_015_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_015_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_015_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_015_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_015_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_015_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_015_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_015_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_015_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_015_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_015_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
