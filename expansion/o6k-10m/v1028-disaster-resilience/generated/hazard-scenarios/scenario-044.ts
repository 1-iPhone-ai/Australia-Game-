import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 044 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_044_META = {
  id: 'hazard_044',
  regionId: 'SA' as V1028DresRegionId,
  primaryChannel: 'rural_clinic' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'recovering' as V1028DresResilienceBand,
  seed: 40605,
} as const;

const V1028_DRES_HAZARD_SCENARIO_044_COEF = {
  k0: 99.6000,
  k1: 72.4000,
  k2: 45.2000,
  k3: 18.0000,
  k4: 90.5000,
  k5: 63.3000,
  k6: 36.1000,
  k7: 8.9000,
  k8: 81.4000,
  k9: 54.2000,
  k10: 27.0000,
  k11: 99.5000,
  k12: 72.3000,
  k13: 45.1000,
  k14: 17.9000,
  k15: 90.4000,
  k16: 63.2000,
  k17: 36.0000,
  k18: 8.8000,
  k19: 81.3000,
  k20: 54.1000,
  k21: 26.9000,
  k22: 99.4000,
  k23: 72.2000,
  k24: 45.0000,
  k25: 17.8000,
  k26: 90.3000,
  k27: 63.1000,
  k28: 35.9000,
  k29: 8.7000,
  k30: 81.2000,
  k31: 54.0000,
  k32: 26.8000,
  k33: 99.3000,
  k34: 72.1000,
  k35: 44.9000,
  k36: 17.7000,
  k37: 90.2000,
  k38: 63.0000,
  k39: 35.8000,
  k40: 8.6000,
  k41: 81.1000,
  k42: 53.9000,
  k43: 26.7000,
  k44: 99.2000,
  k45: 72.0000,
  k46: 44.8000,
  k47: 17.6000,
  k48: 90.1000,
  k49: 62.9000,
  k50: 35.7000,
  k51: 8.5000,
  k52: 81.0000,
  k53: 53.8000,
  k54: 26.6000,
  k55: 99.1000,
  k56: 71.9000,
  k57: 44.7000,
  k58: 17.5000,
  k59: 90.0000,
  k60: 62.8000,
  k61: 35.6000,
  k62: 8.4000,
  k63: 80.9000,
  k64: 53.7000,
  k65: 26.5000,
  k66: 99.0000,
  k67: 71.8000,
  k68: 44.6000,
  k69: 17.4000,
  k70: 89.9000,
  k71: 62.7000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_044_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_044_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_044_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_044_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_044_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_044_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_044_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_044_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_044_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_044_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_044_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_044_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
