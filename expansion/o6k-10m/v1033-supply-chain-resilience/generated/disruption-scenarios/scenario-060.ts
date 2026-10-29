import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 060 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_060_META = {
  id: 'disruption_060',
  regionId: 'SA' as V1033ScresRegionId,
  primaryChannel: 'emergency_care' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'minimal' as V1033ScresSupplyChainResilienceBand,
  seed: 55181,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_060_COEF = {
  k0: 81.5000,
  k1: 16.4000,
  k2: 51.0000,
  k3: 85.6000,
  k4: 20.5000,
  k5: 55.1000,
  k6: 89.7000,
  k7: 24.6000,
  k8: 59.2000,
  k9: 93.8000,
  k10: 28.7000,
  k11: 63.3000,
  k12: 97.9000,
  k13: 32.8000,
  k14: 67.4000,
  k15: 2.3000,
  k16: 36.9000,
  k17: 71.5000,
  k18: 6.4000,
  k19: 41.0000,
  k20: 75.6000,
  k21: 10.5000,
  k22: 45.1000,
  k23: 79.7000,
  k24: 14.6000,
  k25: 49.2000,
  k26: 83.8000,
  k27: 18.7000,
  k28: 53.3000,
  k29: 87.9000,
  k30: 22.8000,
  k31: 57.4000,
  k32: 92.0000,
  k33: 26.9000,
  k34: 61.5000,
  k35: 96.1000,
  k36: 31.0000,
  k37: 65.6000,
  k38: 0.5000,
  k39: 35.1000,
  k40: 69.7000,
  k41: 4.6000,
  k42: 39.2000,
  k43: 73.8000,
  k44: 8.7000,
  k45: 43.3000,
  k46: 77.9000,
  k47: 12.8000,
  k48: 47.4000,
  k49: 82.0000,
  k50: 16.9000,
  k51: 51.5000,
  k52: 86.1000,
  k53: 21.0000,
  k54: 55.6000,
  k55: 90.2000,
  k56: 25.1000,
  k57: 59.7000,
  k58: 94.3000,
  k59: 29.2000,
  k60: 63.8000,
  k61: 98.4000,
  k62: 33.3000,
  k63: 67.9000,
  k64: 2.8000,
  k65: 37.4000,
  k66: 72.0000,
  k67: 6.9000,
  k68: 41.5000,
  k69: 76.1000,
  k70: 11.0000,
  k71: 45.6000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_060_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_060_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_060_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_060_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_060_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_060_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_060_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_060_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_060_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_060_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_060_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_060_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
