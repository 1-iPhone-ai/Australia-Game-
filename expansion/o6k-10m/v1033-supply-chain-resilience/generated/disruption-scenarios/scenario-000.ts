import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 000 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_000_META = {
  id: 'disruption_000',
  regionId: 'NSW' as V1033ScresRegionId,
  primaryChannel: 'emergency_care' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'minimal' as V1033ScresSupplyChainResilienceBand,
  seed: 521,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_000_COEF = {
  k0: 74.6000,
  k1: 27.0000,
  k2: 79.1000,
  k3: 31.5000,
  k4: 83.6000,
  k5: 36.0000,
  k6: 88.1000,
  k7: 40.5000,
  k8: 92.6000,
  k9: 45.0000,
  k10: 97.1000,
  k11: 49.5000,
  k12: 1.9000,
  k13: 54.0000,
  k14: 6.4000,
  k15: 58.5000,
  k16: 10.9000,
  k17: 63.0000,
  k18: 15.4000,
  k19: 67.5000,
  k20: 19.9000,
  k21: 72.0000,
  k22: 24.4000,
  k23: 76.5000,
  k24: 28.9000,
  k25: 81.0000,
  k26: 33.4000,
  k27: 85.5000,
  k28: 37.9000,
  k29: 90.0000,
  k30: 42.4000,
  k31: 94.5000,
  k32: 46.9000,
  k33: 99.0000,
  k34: 51.4000,
  k35: 3.8000,
  k36: 55.9000,
  k37: 8.3000,
  k38: 60.4000,
  k39: 12.8000,
  k40: 64.9000,
  k41: 17.3000,
  k42: 69.4000,
  k43: 21.8000,
  k44: 73.9000,
  k45: 26.3000,
  k46: 78.4000,
  k47: 30.8000,
  k48: 82.9000,
  k49: 35.3000,
  k50: 87.4000,
  k51: 39.8000,
  k52: 91.9000,
  k53: 44.3000,
  k54: 96.4000,
  k55: 48.8000,
  k56: 1.2000,
  k57: 53.3000,
  k58: 5.7000,
  k59: 57.8000,
  k60: 10.2000,
  k61: 62.3000,
  k62: 14.7000,
  k63: 66.8000,
  k64: 19.2000,
  k65: 71.3000,
  k66: 23.7000,
  k67: 75.8000,
  k68: 28.2000,
  k69: 80.3000,
  k70: 32.7000,
  k71: 84.8000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_000_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_000_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_000_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_000_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_000_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_000_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_000_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_000_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_000_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_000_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_000_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_000_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
