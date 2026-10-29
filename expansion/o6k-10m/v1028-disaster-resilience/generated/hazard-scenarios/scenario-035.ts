import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 035 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_035_META = {
  id: 'hazard_035',
  regionId: 'WA' as V1028DresRegionId,
  primaryChannel: 'specialist_referral' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'minimal' as V1028DresResilienceBand,
  seed: 32406,
} as const;

const V1028_DRES_HAZARD_SCENARIO_035_COEF = {
  k0: 53.7000,
  k1: 4.2000,
  k2: 54.4000,
  k3: 4.9000,
  k4: 55.1000,
  k5: 5.6000,
  k6: 55.8000,
  k7: 6.3000,
  k8: 56.5000,
  k9: 7.0000,
  k10: 57.2000,
  k11: 7.7000,
  k12: 57.9000,
  k13: 8.4000,
  k14: 58.6000,
  k15: 9.1000,
  k16: 59.3000,
  k17: 9.8000,
  k18: 60.0000,
  k19: 10.5000,
  k20: 60.7000,
  k21: 11.2000,
  k22: 61.4000,
  k23: 11.9000,
  k24: 62.1000,
  k25: 12.6000,
  k26: 62.8000,
  k27: 13.3000,
  k28: 63.5000,
  k29: 14.0000,
  k30: 64.2000,
  k31: 14.7000,
  k32: 64.9000,
  k33: 15.4000,
  k34: 65.6000,
  k35: 16.1000,
  k36: 66.3000,
  k37: 16.8000,
  k38: 67.0000,
  k39: 17.5000,
  k40: 67.7000,
  k41: 18.2000,
  k42: 68.4000,
  k43: 18.9000,
  k44: 69.1000,
  k45: 19.6000,
  k46: 69.8000,
  k47: 20.3000,
  k48: 70.5000,
  k49: 21.0000,
  k50: 71.2000,
  k51: 21.7000,
  k52: 71.9000,
  k53: 22.4000,
  k54: 72.6000,
  k55: 23.1000,
  k56: 73.3000,
  k57: 23.8000,
  k58: 74.0000,
  k59: 24.5000,
  k60: 74.7000,
  k61: 25.2000,
  k62: 75.4000,
  k63: 25.9000,
  k64: 76.1000,
  k65: 26.6000,
  k66: 76.8000,
  k67: 27.3000,
  k68: 77.5000,
  k69: 28.0000,
  k70: 78.2000,
  k71: 28.7000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_035_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_035_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_035_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_035_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_035_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_035_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_035_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_035_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_035_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_035_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_035_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_035_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
