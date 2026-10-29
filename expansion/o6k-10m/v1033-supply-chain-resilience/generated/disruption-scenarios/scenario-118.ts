import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 118 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_118_META = {
  id: 'disruption_118',
  regionId: 'NT' as V1033ScresRegionId,
  primaryChannel: 'regional' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'critical' as V1033ScresSupplyChainResilienceBand,
  seed: 108019,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_118_COEF = {
  k0: 78.2000,
  k1: 12.8000,
  k2: 47.1000,
  k3: 81.4000,
  k4: 16.0000,
  k5: 50.3000,
  k6: 84.6000,
  k7: 19.2000,
  k8: 53.5000,
  k9: 87.8000,
  k10: 22.4000,
  k11: 56.7000,
  k12: 91.0000,
  k13: 25.6000,
  k14: 59.9000,
  k15: 94.2000,
  k16: 28.8000,
  k17: 63.1000,
  k18: 97.4000,
  k19: 32.0000,
  k20: 66.3000,
  k21: 0.9000,
  k22: 35.2000,
  k23: 69.5000,
  k24: 4.1000,
  k25: 38.4000,
  k26: 72.7000,
  k27: 7.3000,
  k28: 41.6000,
  k29: 75.9000,
  k30: 10.5000,
  k31: 44.8000,
  k32: 79.1000,
  k33: 13.7000,
  k34: 48.0000,
  k35: 82.3000,
  k36: 16.9000,
  k37: 51.2000,
  k38: 85.5000,
  k39: 20.1000,
  k40: 54.4000,
  k41: 88.7000,
  k42: 23.3000,
  k43: 57.6000,
  k44: 91.9000,
  k45: 26.5000,
  k46: 60.8000,
  k47: 95.1000,
  k48: 29.7000,
  k49: 64.0000,
  k50: 98.3000,
  k51: 32.9000,
  k52: 67.2000,
  k53: 1.8000,
  k54: 36.1000,
  k55: 70.4000,
  k56: 5.0000,
  k57: 39.3000,
  k58: 73.6000,
  k59: 8.2000,
  k60: 42.5000,
  k61: 76.8000,
  k62: 11.4000,
  k63: 45.7000,
  k64: 80.0000,
  k65: 14.6000,
  k66: 48.9000,
  k67: 83.2000,
  k68: 17.8000,
  k69: 52.1000,
  k70: 86.4000,
  k71: 21.0000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_118_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_118_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_118_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_118_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_118_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_118_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_118_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_118_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_118_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_118_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_118_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_118_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
