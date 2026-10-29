import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 009 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_009_META = {
  id: 'disruption_009',
  regionId: 'VIC' as V1033ScresRegionId,
  primaryChannel: 'remote' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'recovering' as V1033ScresSupplyChainResilienceBand,
  seed: 8720,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_009_COEF = {
  k0: 20.8000,
  k1: 95.2000,
  k2: 69.9000,
  k3: 44.6000,
  k4: 19.3000,
  k5: 93.7000,
  k6: 68.4000,
  k7: 43.1000,
  k8: 17.8000,
  k9: 92.2000,
  k10: 66.9000,
  k11: 41.6000,
  k12: 16.3000,
  k13: 90.7000,
  k14: 65.4000,
  k15: 40.1000,
  k16: 14.8000,
  k17: 89.2000,
  k18: 63.9000,
  k19: 38.6000,
  k20: 13.3000,
  k21: 87.7000,
  k22: 62.4000,
  k23: 37.1000,
  k24: 11.8000,
  k25: 86.2000,
  k26: 60.9000,
  k27: 35.6000,
  k28: 10.3000,
  k29: 84.7000,
  k30: 59.4000,
  k31: 34.1000,
  k32: 8.8000,
  k33: 83.2000,
  k34: 57.9000,
  k35: 32.6000,
  k36: 7.3000,
  k37: 81.7000,
  k38: 56.4000,
  k39: 31.1000,
  k40: 5.8000,
  k41: 80.2000,
  k42: 54.9000,
  k43: 29.6000,
  k44: 4.3000,
  k45: 78.7000,
  k46: 53.4000,
  k47: 28.1000,
  k48: 2.8000,
  k49: 77.2000,
  k50: 51.9000,
  k51: 26.6000,
  k52: 1.3000,
  k53: 75.7000,
  k54: 50.4000,
  k55: 25.1000,
  k56: 99.5000,
  k57: 74.2000,
  k58: 48.9000,
  k59: 23.6000,
  k60: 98.0000,
  k61: 72.7000,
  k62: 47.4000,
  k63: 22.1000,
  k64: 96.5000,
  k65: 71.2000,
  k66: 45.9000,
  k67: 20.6000,
  k68: 95.0000,
  k69: 69.7000,
  k70: 44.4000,
  k71: 19.1000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_009_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_009_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_009_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_009_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_009_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_009_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_009_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_009_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_009_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_009_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_009_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_009_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
