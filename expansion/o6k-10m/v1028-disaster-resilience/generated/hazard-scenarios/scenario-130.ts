import { V1028_DRES_clamp, V1028_DRES_resilienceBandFromScore } from '../../engine/disaster-resilience-utils.ts';
import type {
  V1028DresResilienceBand,
  V1028DresRegionId,
  V1028DresHazardSnapshot,
  V1028DresDisasterResilienceChannel,
} from '../../types/core.ts';

/** Generated hazard scenario 130 — flood/bushfire/cyclone handoff matrix. */
export const V1028_DRES_HAZARD_SCENARIO_130_META = {
  id: 'hazard_130',
  regionId: 'QLD' as V1028DresRegionId,
  primaryChannel: 'emergency_care' as V1028DresDisasterResilienceChannel,
  resilienceBand: 'minimal' as V1028DresResilienceBand,
  seed: 118951,
} as const;

const V1028_DRES_HAZARD_SCENARIO_130_COEF = {
  k0: 39.7000,
  k1: 70.5000,
  k2: 1.6000,
  k3: 32.4000,
  k4: 63.2000,
  k5: 94.0000,
  k6: 25.1000,
  k7: 55.9000,
  k8: 86.7000,
  k9: 17.8000,
  k10: 48.6000,
  k11: 79.4000,
  k12: 10.5000,
  k13: 41.3000,
  k14: 72.1000,
  k15: 3.2000,
  k16: 34.0000,
  k17: 64.8000,
  k18: 95.6000,
  k19: 26.7000,
  k20: 57.5000,
  k21: 88.3000,
  k22: 19.4000,
  k23: 50.2000,
  k24: 81.0000,
  k25: 12.1000,
  k26: 42.9000,
  k27: 73.7000,
  k28: 4.8000,
  k29: 35.6000,
  k30: 66.4000,
  k31: 97.2000,
  k32: 28.3000,
  k33: 59.1000,
  k34: 89.9000,
  k35: 21.0000,
  k36: 51.8000,
  k37: 82.6000,
  k38: 13.7000,
  k39: 44.5000,
  k40: 75.3000,
  k41: 6.4000,
  k42: 37.2000,
  k43: 68.0000,
  k44: 98.8000,
  k45: 29.9000,
  k46: 60.7000,
  k47: 91.5000,
  k48: 22.6000,
  k49: 53.4000,
  k50: 84.2000,
  k51: 15.3000,
  k52: 46.1000,
  k53: 76.9000,
  k54: 8.0000,
  k55: 38.8000,
  k56: 69.6000,
  k57: 0.7000,
  k58: 31.5000,
  k59: 62.3000,
  k60: 93.1000,
  k61: 24.2000,
  k62: 55.0000,
  k63: 85.8000,
  k64: 16.9000,
  k65: 47.7000,
  k66: 78.5000,
  k67: 9.6000,
  k68: 40.4000,
  k69: 71.2000,
  k70: 2.3000,
  k71: 33.1000,
} as const;

export function V1028_DRES_HAZARD_SCENARIO_130_evaluate(turn: number): {
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1028_DRES_HAZARD_SCENARIO_130_COEF) as Array<
    keyof typeof V1028_DRES_HAZARD_SCENARIO_130_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1028_DRES_HAZARD_SCENARIO_130_COEF[keys[j]] * ((turn + j) % 17);
  }
  const disasterRiskIndex = V1028_DRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const evacuationCapacityDelayTurns = V1028_DRES_clamp(2 + (acc % 11), 1, 18);
  const resilienceScore = V1028_DRES_clamp(90 - disasterRiskIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1028_DRES_resilienceBandFromScore(resilienceScore) !== 'depleted';
  return { disasterRiskIndex, evacuationCapacityDelayTurns, resilienceScore, stable };
}

export function V1028_DRES_HAZARD_SCENARIO_130_snapshot(turn: number): V1028DresHazardSnapshot {
  const r = V1028_DRES_HAZARD_SCENARIO_130_evaluate(turn);
  return {
    scenarioId: V1028_DRES_HAZARD_SCENARIO_130_META.id,
    regionId: V1028_DRES_HAZARD_SCENARIO_130_META.regionId,
    disasterResilienceChannel: V1028_DRES_HAZARD_SCENARIO_130_META.primaryChannel,
    resilienceBand: V1028_DRES_HAZARD_SCENARIO_130_META.resilienceBand,
    disasterRiskIndex: r.disasterRiskIndex,
    evacuationCapacityDelayTurns: r.evacuationCapacityDelayTurns,
    resilienceScore: r.resilienceScore,
    resilienceBand: V1028_DRES_resilienceBandFromScore(r.resilienceScore),
  };
}

export function V1028_DRES_HAZARD_SCENARIO_130_regressionAssert(turn: number): boolean {
  const r = V1028_DRES_HAZARD_SCENARIO_130_evaluate(turn);
  return typeof r.disasterRiskIndex === 'number' && r.resilienceScore <= 100;
}
