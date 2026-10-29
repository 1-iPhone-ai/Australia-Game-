import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 147 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_147_META = {
  id: 'disruption_147',
  regionId: 'WA' as V1033ScresRegionId,
  primaryChannel: 'mental_health' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'elevated' as V1033ScresSupplyChainResilienceBand,
  seed: 134438,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_147_COEF = {
  k0: 26.7000,
  k1: 11.0000,
  k2: 95.0000,
  k3: 79.3000,
  k4: 63.6000,
  k5: 47.9000,
  k6: 32.2000,
  k7: 16.5000,
  k8: 0.8000,
  k9: 84.8000,
  k10: 69.1000,
  k11: 53.4000,
  k12: 37.7000,
  k13: 22.0000,
  k14: 6.3000,
  k15: 90.3000,
  k16: 74.6000,
  k17: 58.9000,
  k18: 43.2000,
  k19: 27.5000,
  k20: 11.8000,
  k21: 95.8000,
  k22: 80.1000,
  k23: 64.4000,
  k24: 48.7000,
  k25: 33.0000,
  k26: 17.3000,
  k27: 1.6000,
  k28: 85.6000,
  k29: 69.9000,
  k30: 54.2000,
  k31: 38.5000,
  k32: 22.8000,
  k33: 7.1000,
  k34: 91.1000,
  k35: 75.4000,
  k36: 59.7000,
  k37: 44.0000,
  k38: 28.3000,
  k39: 12.6000,
  k40: 96.6000,
  k41: 80.9000,
  k42: 65.2000,
  k43: 49.5000,
  k44: 33.8000,
  k45: 18.1000,
  k46: 2.4000,
  k47: 86.4000,
  k48: 70.7000,
  k49: 55.0000,
  k50: 39.3000,
  k51: 23.6000,
  k52: 7.9000,
  k53: 91.9000,
  k54: 76.2000,
  k55: 60.5000,
  k56: 44.8000,
  k57: 29.1000,
  k58: 13.4000,
  k59: 97.4000,
  k60: 81.7000,
  k61: 66.0000,
  k62: 50.3000,
  k63: 34.6000,
  k64: 18.9000,
  k65: 3.2000,
  k66: 87.2000,
  k67: 71.5000,
  k68: 55.8000,
  k69: 40.1000,
  k70: 24.4000,
  k71: 8.7000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_147_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_147_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_147_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_147_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_147_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_147_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_147_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_147_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_147_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_147_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_147_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_147_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
