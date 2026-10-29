import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 088 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_088_META = {
  id: 'disruption_088',
  regionId: 'NSW' as V1033ScresRegionId,
  primaryChannel: 'regional' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'critical' as V1033ScresSupplyChainResilienceBand,
  seed: 80689,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_088_COEF = {
  k0: 24.9000,
  k1: 18.1000,
  k2: 11.3000,
  k3: 4.5000,
  k4: 97.4000,
  k5: 90.6000,
  k6: 83.8000,
  k7: 77.0000,
  k8: 70.2000,
  k9: 63.4000,
  k10: 56.6000,
  k11: 49.8000,
  k12: 43.0000,
  k13: 36.2000,
  k14: 29.4000,
  k15: 22.6000,
  k16: 15.8000,
  k17: 9.0000,
  k18: 2.2000,
  k19: 95.1000,
  k20: 88.3000,
  k21: 81.5000,
  k22: 74.7000,
  k23: 67.9000,
  k24: 61.1000,
  k25: 54.3000,
  k26: 47.5000,
  k27: 40.7000,
  k28: 33.9000,
  k29: 27.1000,
  k30: 20.3000,
  k31: 13.5000,
  k32: 6.7000,
  k33: 99.6000,
  k34: 92.8000,
  k35: 86.0000,
  k36: 79.2000,
  k37: 72.4000,
  k38: 65.6000,
  k39: 58.8000,
  k40: 52.0000,
  k41: 45.2000,
  k42: 38.4000,
  k43: 31.6000,
  k44: 24.8000,
  k45: 18.0000,
  k46: 11.2000,
  k47: 4.4000,
  k48: 97.3000,
  k49: 90.5000,
  k50: 83.7000,
  k51: 76.9000,
  k52: 70.1000,
  k53: 63.3000,
  k54: 56.5000,
  k55: 49.7000,
  k56: 42.9000,
  k57: 36.1000,
  k58: 29.3000,
  k59: 22.5000,
  k60: 15.7000,
  k61: 8.9000,
  k62: 2.1000,
  k63: 95.0000,
  k64: 88.2000,
  k65: 81.4000,
  k66: 74.6000,
  k67: 67.8000,
  k68: 61.0000,
  k69: 54.2000,
  k70: 47.4000,
  k71: 40.6000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_088_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_088_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_088_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_088_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_088_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_088_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_088_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_088_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_088_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_088_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_088_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_088_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
