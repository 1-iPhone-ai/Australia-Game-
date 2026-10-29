import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 008 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_008_META = {
  id: 'disruption_008',
  regionId: 'NSW' as V1033ScresRegionId,
  primaryChannel: 'regional' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'critical' as V1033ScresSupplyChainResilienceBand,
  seed: 7809,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_008_COEF = {
  k0: 15.7000,
  k1: 98.7000,
  k2: 82.0000,
  k3: 65.3000,
  k4: 48.6000,
  k5: 31.9000,
  k6: 15.2000,
  k7: 98.2000,
  k8: 81.5000,
  k9: 64.8000,
  k10: 48.1000,
  k11: 31.4000,
  k12: 14.7000,
  k13: 97.7000,
  k14: 81.0000,
  k15: 64.3000,
  k16: 47.6000,
  k17: 30.9000,
  k18: 14.2000,
  k19: 97.2000,
  k20: 80.5000,
  k21: 63.8000,
  k22: 47.1000,
  k23: 30.4000,
  k24: 13.7000,
  k25: 96.7000,
  k26: 80.0000,
  k27: 63.3000,
  k28: 46.6000,
  k29: 29.9000,
  k30: 13.2000,
  k31: 96.2000,
  k32: 79.5000,
  k33: 62.8000,
  k34: 46.1000,
  k35: 29.4000,
  k36: 12.7000,
  k37: 95.7000,
  k38: 79.0000,
  k39: 62.3000,
  k40: 45.6000,
  k41: 28.9000,
  k42: 12.2000,
  k43: 95.2000,
  k44: 78.5000,
  k45: 61.8000,
  k46: 45.1000,
  k47: 28.4000,
  k48: 11.7000,
  k49: 94.7000,
  k50: 78.0000,
  k51: 61.3000,
  k52: 44.6000,
  k53: 27.9000,
  k54: 11.2000,
  k55: 94.2000,
  k56: 77.5000,
  k57: 60.8000,
  k58: 44.1000,
  k59: 27.4000,
  k60: 10.7000,
  k61: 93.7000,
  k62: 77.0000,
  k63: 60.3000,
  k64: 43.6000,
  k65: 26.9000,
  k66: 10.2000,
  k67: 93.2000,
  k68: 76.5000,
  k69: 59.8000,
  k70: 43.1000,
  k71: 26.4000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_008_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_008_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_008_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_008_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_008_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_008_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_008_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_008_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_008_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_008_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_008_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_008_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
