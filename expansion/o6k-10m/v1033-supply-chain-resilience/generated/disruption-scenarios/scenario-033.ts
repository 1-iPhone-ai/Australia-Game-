import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 033 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_033_META = {
  id: 'disruption_033',
  regionId: 'VIC' as V1033ScresRegionId,
  primaryChannel: 'telehealth' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'critical' as V1033ScresSupplyChainResilienceBand,
  seed: 30584,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_033_COEF = {
  k0: 43.5000,
  k1: 11.2000,
  k2: 78.6000,
  k3: 46.3000,
  k4: 14.0000,
  k5: 81.4000,
  k6: 49.1000,
  k7: 16.8000,
  k8: 84.2000,
  k9: 51.9000,
  k10: 19.6000,
  k11: 87.0000,
  k12: 54.7000,
  k13: 22.4000,
  k14: 89.8000,
  k15: 57.5000,
  k16: 25.2000,
  k17: 92.6000,
  k18: 60.3000,
  k19: 28.0000,
  k20: 95.4000,
  k21: 63.1000,
  k22: 30.8000,
  k23: 98.2000,
  k24: 65.9000,
  k25: 33.6000,
  k26: 1.3000,
  k27: 68.7000,
  k28: 36.4000,
  k29: 4.1000,
  k30: 71.5000,
  k31: 39.2000,
  k32: 6.9000,
  k33: 74.3000,
  k34: 42.0000,
  k35: 9.7000,
  k36: 77.1000,
  k37: 44.8000,
  k38: 12.5000,
  k39: 79.9000,
  k40: 47.6000,
  k41: 15.3000,
  k42: 82.7000,
  k43: 50.4000,
  k44: 18.1000,
  k45: 85.5000,
  k46: 53.2000,
  k47: 20.9000,
  k48: 88.3000,
  k49: 56.0000,
  k50: 23.7000,
  k51: 91.1000,
  k52: 58.8000,
  k53: 26.5000,
  k54: 93.9000,
  k55: 61.6000,
  k56: 29.3000,
  k57: 96.7000,
  k58: 64.4000,
  k59: 32.1000,
  k60: 99.5000,
  k61: 67.2000,
  k62: 34.9000,
  k63: 2.6000,
  k64: 70.0000,
  k65: 37.7000,
  k66: 5.4000,
  k67: 72.8000,
  k68: 40.5000,
  k69: 8.2000,
  k70: 75.6000,
  k71: 43.3000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_033_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_033_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_033_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_033_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_033_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_033_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_033_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_033_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_033_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_033_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_033_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_033_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
