import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 156 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_156_META = {
  id: 'disruption_156',
  regionId: 'SA' as V1033ScresRegionId,
  primaryChannel: 'aged_care' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'moderate' as V1033ScresSupplyChainResilienceBand,
  seed: 142637,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_156_COEF = {
  k0: 72.6000,
  k1: 79.2000,
  k2: 85.8000,
  k3: 92.4000,
  k4: 99.0000,
  k5: 5.9000,
  k6: 12.5000,
  k7: 19.1000,
  k8: 25.7000,
  k9: 32.3000,
  k10: 38.9000,
  k11: 45.5000,
  k12: 52.1000,
  k13: 58.7000,
  k14: 65.3000,
  k15: 71.9000,
  k16: 78.5000,
  k17: 85.1000,
  k18: 91.7000,
  k19: 98.3000,
  k20: 5.2000,
  k21: 11.8000,
  k22: 18.4000,
  k23: 25.0000,
  k24: 31.6000,
  k25: 38.2000,
  k26: 44.8000,
  k27: 51.4000,
  k28: 58.0000,
  k29: 64.6000,
  k30: 71.2000,
  k31: 77.8000,
  k32: 84.4000,
  k33: 91.0000,
  k34: 97.6000,
  k35: 4.5000,
  k36: 11.1000,
  k37: 17.7000,
  k38: 24.3000,
  k39: 30.9000,
  k40: 37.5000,
  k41: 44.1000,
  k42: 50.7000,
  k43: 57.3000,
  k44: 63.9000,
  k45: 70.5000,
  k46: 77.1000,
  k47: 83.7000,
  k48: 90.3000,
  k49: 96.9000,
  k50: 3.8000,
  k51: 10.4000,
  k52: 17.0000,
  k53: 23.6000,
  k54: 30.2000,
  k55: 36.8000,
  k56: 43.4000,
  k57: 50.0000,
  k58: 56.6000,
  k59: 63.2000,
  k60: 69.8000,
  k61: 76.4000,
  k62: 83.0000,
  k63: 89.6000,
  k64: 96.2000,
  k65: 3.1000,
  k66: 9.7000,
  k67: 16.3000,
  k68: 22.9000,
  k69: 29.5000,
  k70: 36.1000,
  k71: 42.7000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_156_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_156_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_156_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_156_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_156_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_156_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_156_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_156_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_156_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_156_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_156_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_156_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
