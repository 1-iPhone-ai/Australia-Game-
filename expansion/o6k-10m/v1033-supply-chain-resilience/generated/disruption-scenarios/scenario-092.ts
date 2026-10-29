import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 092 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_092_META = {
  id: 'disruption_092',
  regionId: 'SA' as V1033ScresRegionId,
  primaryChannel: 'hub_zone' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'elevated' as V1033ScresSupplyChainResilienceBand,
  seed: 84333,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_092_COEF = {
  k0: 45.3000,
  k1: 4.1000,
  k2: 62.6000,
  k3: 21.4000,
  k4: 79.9000,
  k5: 38.7000,
  k6: 97.2000,
  k7: 56.0000,
  k8: 14.8000,
  k9: 73.3000,
  k10: 32.1000,
  k11: 90.6000,
  k12: 49.4000,
  k13: 8.2000,
  k14: 66.7000,
  k15: 25.5000,
  k16: 84.0000,
  k17: 42.8000,
  k18: 1.6000,
  k19: 60.1000,
  k20: 18.9000,
  k21: 77.4000,
  k22: 36.2000,
  k23: 94.7000,
  k24: 53.5000,
  k25: 12.3000,
  k26: 70.8000,
  k27: 29.6000,
  k28: 88.1000,
  k29: 46.9000,
  k30: 5.7000,
  k31: 64.2000,
  k32: 23.0000,
  k33: 81.5000,
  k34: 40.3000,
  k35: 98.8000,
  k36: 57.6000,
  k37: 16.4000,
  k38: 74.9000,
  k39: 33.7000,
  k40: 92.2000,
  k41: 51.0000,
  k42: 9.8000,
  k43: 68.3000,
  k44: 27.1000,
  k45: 85.6000,
  k46: 44.4000,
  k47: 3.2000,
  k48: 61.7000,
  k49: 20.5000,
  k50: 79.0000,
  k51: 37.8000,
  k52: 96.3000,
  k53: 55.1000,
  k54: 13.9000,
  k55: 72.4000,
  k56: 31.2000,
  k57: 89.7000,
  k58: 48.5000,
  k59: 7.3000,
  k60: 65.8000,
  k61: 24.6000,
  k62: 83.1000,
  k63: 41.9000,
  k64: 0.7000,
  k65: 59.2000,
  k66: 18.0000,
  k67: 76.5000,
  k68: 35.3000,
  k69: 93.8000,
  k70: 52.6000,
  k71: 11.4000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_092_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_092_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_092_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_092_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_092_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_092_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_092_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_092_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_092_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_092_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_092_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_092_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
