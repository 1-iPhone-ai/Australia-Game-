import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 042 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_042_META = {
  id: 'disruption_042',
  regionId: 'QLD' as V1033ScresRegionId,
  primaryChannel: 'hub_zone' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'elevated' as V1033ScresSupplyChainResilienceBand,
  seed: 38783,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_042_COEF = {
  k0: 89.4000,
  k1: 79.4000,
  k2: 69.4000,
  k3: 59.4000,
  k4: 49.4000,
  k5: 39.4000,
  k6: 29.4000,
  k7: 19.4000,
  k8: 9.4000,
  k9: 99.1000,
  k10: 89.1000,
  k11: 79.1000,
  k12: 69.1000,
  k13: 59.1000,
  k14: 49.1000,
  k15: 39.1000,
  k16: 29.1000,
  k17: 19.1000,
  k18: 9.1000,
  k19: 98.8000,
  k20: 88.8000,
  k21: 78.8000,
  k22: 68.8000,
  k23: 58.8000,
  k24: 48.8000,
  k25: 38.8000,
  k26: 28.8000,
  k27: 18.8000,
  k28: 8.8000,
  k29: 98.5000,
  k30: 88.5000,
  k31: 78.5000,
  k32: 68.5000,
  k33: 58.5000,
  k34: 48.5000,
  k35: 38.5000,
  k36: 28.5000,
  k37: 18.5000,
  k38: 8.5000,
  k39: 98.2000,
  k40: 88.2000,
  k41: 78.2000,
  k42: 68.2000,
  k43: 58.2000,
  k44: 48.2000,
  k45: 38.2000,
  k46: 28.2000,
  k47: 18.2000,
  k48: 8.2000,
  k49: 97.9000,
  k50: 87.9000,
  k51: 77.9000,
  k52: 67.9000,
  k53: 57.9000,
  k54: 47.9000,
  k55: 37.9000,
  k56: 27.9000,
  k57: 17.9000,
  k58: 7.9000,
  k59: 97.6000,
  k60: 87.6000,
  k61: 77.6000,
  k62: 67.6000,
  k63: 57.6000,
  k64: 47.6000,
  k65: 37.6000,
  k66: 27.6000,
  k67: 17.6000,
  k68: 7.6000,
  k69: 97.3000,
  k70: 87.3000,
  k71: 77.3000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_042_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_042_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_042_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_042_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_042_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_042_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_042_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_042_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_042_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_042_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_042_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_042_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
