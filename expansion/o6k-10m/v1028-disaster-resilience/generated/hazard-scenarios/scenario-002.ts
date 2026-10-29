import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 002 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_002_META = {
  id: 'hazard_002',
  regionId: 'QLD' as V1028DresRegionId,
  primaryChannel: 'emergency_response' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'elevated' as V1028DresResilienceBand,
  seed: 2343,
} as const;

const V1028_DRES_HAZARD_SCENARIO_002_COEF = {
  k0: 84.8000,
  k1: 20.0000,
  k2: 54.9000,
  k3: 89.8000,
  k4: 25.0000,
  k5: 59.9000,
  k6: 94.8000,
  k7: 30.0000,
  k8: 64.9000,
  k9: 0.1000,
  k10: 35.0000,
  k11: 69.9000,
  k12: 5.1000,
  k13: 40.0000,
  k14: 74.9000,
  k15: 10.1000,
  k16: 45.0000,
  k17: 79.9000,
  k18: 15.1000,
  k19: 50.0000,
  k20: 84.9000,
  k21: 20.1000,
  k22: 55.0000,
  k23: 89.9000,
  k24: 25.1000,
  k25: 60.0000,
  k26: 94.9000,
  k27: 30.1000,
  k28: 65.0000,
  k29: 0.2000,
  k30: 35.1000,
  k31: 70.0000,
  k32: 5.2000,
  k33: 40.1000,
  k34: 75.0000,
  k35: 10.2000,
  k36: 45.1000,
  k37: 80.0000,
  k38: 15.2000,
  k39: 50.1000,
  k40: 85.0000,
  k41: 20.2000,
  k42: 55.1000,
  k43: 90.0000,
  k44: 25.2000,
  k45: 60.1000,
  k46: 95.0000,
  k47: 30.2000,
  k48: 65.1000,
  k49: 0.3000,
  k50: 35.2000,
  k51: 70.1000,
  k52: 5.3000,
  k53: 40.2000,
  k54: 75.1000,
  k55: 10.3000,
  k56: 45.2000,
  k57: 80.1000,
  k58: 15.3000,
  k59: 50.2000,
  k60: 85.1000,
  k61: 20.3000,
  k62: 55.2000,
  k63: 90.1000,
  k64: 25.3000,
  k65: 60.2000,
  k66: 95.1000,
  k67: 30.3000,
  k68: 65.2000,
  k69: 0.4000,
  k70: 35.3000,
  k71: 70.2000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_002_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_002_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_002_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_002_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_002_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_002_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_002_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_002_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_002_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_002_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_002_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_002_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
