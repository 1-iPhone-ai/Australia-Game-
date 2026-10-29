import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 157 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_157_META = {
  id: 'disruption_157',
  regionId: 'TAS' as V1033ScresRegionId,
  primaryChannel: 'mental_health' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'elevated' as V1033ScresSupplyChainResilienceBand,
  seed: 143548,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_157_COEF = {
  k0: 77.7000,
  k1: 75.7000,
  k2: 73.7000,
  k3: 71.7000,
  k4: 69.7000,
  k5: 67.7000,
  k6: 65.7000,
  k7: 63.7000,
  k8: 61.7000,
  k9: 59.7000,
  k10: 57.7000,
  k11: 55.7000,
  k12: 53.7000,
  k13: 51.7000,
  k14: 49.7000,
  k15: 47.7000,
  k16: 45.7000,
  k17: 43.7000,
  k18: 41.7000,
  k19: 39.7000,
  k20: 37.7000,
  k21: 35.7000,
  k22: 33.7000,
  k23: 31.7000,
  k24: 29.7000,
  k25: 27.7000,
  k26: 25.7000,
  k27: 23.7000,
  k28: 21.7000,
  k29: 19.7000,
  k30: 17.7000,
  k31: 15.7000,
  k32: 13.7000,
  k33: 11.7000,
  k34: 9.7000,
  k35: 7.7000,
  k36: 5.7000,
  k37: 3.7000,
  k38: 1.7000,
  k39: 99.4000,
  k40: 97.4000,
  k41: 95.4000,
  k42: 93.4000,
  k43: 91.4000,
  k44: 89.4000,
  k45: 87.4000,
  k46: 85.4000,
  k47: 83.4000,
  k48: 81.4000,
  k49: 79.4000,
  k50: 77.4000,
  k51: 75.4000,
  k52: 73.4000,
  k53: 71.4000,
  k54: 69.4000,
  k55: 67.4000,
  k56: 65.4000,
  k57: 63.4000,
  k58: 61.4000,
  k59: 59.4000,
  k60: 57.4000,
  k61: 55.4000,
  k62: 53.4000,
  k63: 51.4000,
  k64: 49.4000,
  k65: 47.4000,
  k66: 45.4000,
  k67: 43.4000,
  k68: 41.4000,
  k69: 39.4000,
  k70: 37.4000,
  k71: 35.4000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_157_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_157_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_157_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_157_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_157_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_157_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_157_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_157_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_157_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_157_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_157_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_157_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
