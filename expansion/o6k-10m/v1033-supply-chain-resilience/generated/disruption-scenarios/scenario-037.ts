import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 037 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_037_META = {
  id: 'disruption_037',
  regionId: 'TAS' as V1033ScresRegionId,
  primaryChannel: 'mental_health' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'elevated' as V1033ScresSupplyChainResilienceBand,
  seed: 34228,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_037_COEF = {
  k0: 63.9000,
  k1: 96.9000,
  k2: 30.2000,
  k3: 63.2000,
  k4: 96.2000,
  k5: 29.5000,
  k6: 62.5000,
  k7: 95.5000,
  k8: 28.8000,
  k9: 61.8000,
  k10: 94.8000,
  k11: 28.1000,
  k12: 61.1000,
  k13: 94.1000,
  k14: 27.4000,
  k15: 60.4000,
  k16: 93.4000,
  k17: 26.7000,
  k18: 59.7000,
  k19: 92.7000,
  k20: 26.0000,
  k21: 59.0000,
  k22: 92.0000,
  k23: 25.3000,
  k24: 58.3000,
  k25: 91.3000,
  k26: 24.6000,
  k27: 57.6000,
  k28: 90.6000,
  k29: 23.9000,
  k30: 56.9000,
  k31: 89.9000,
  k32: 23.2000,
  k33: 56.2000,
  k34: 89.2000,
  k35: 22.5000,
  k36: 55.5000,
  k37: 88.5000,
  k38: 21.8000,
  k39: 54.8000,
  k40: 87.8000,
  k41: 21.1000,
  k42: 54.1000,
  k43: 87.1000,
  k44: 20.4000,
  k45: 53.4000,
  k46: 86.4000,
  k47: 19.7000,
  k48: 52.7000,
  k49: 85.7000,
  k50: 19.0000,
  k51: 52.0000,
  k52: 85.0000,
  k53: 18.3000,
  k54: 51.3000,
  k55: 84.3000,
  k56: 17.6000,
  k57: 50.6000,
  k58: 83.6000,
  k59: 16.9000,
  k60: 49.9000,
  k61: 82.9000,
  k62: 16.2000,
  k63: 49.2000,
  k64: 82.2000,
  k65: 15.5000,
  k66: 48.5000,
  k67: 81.5000,
  k68: 14.8000,
  k69: 47.8000,
  k70: 80.8000,
  k71: 14.1000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_037_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_037_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_037_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_037_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_037_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_037_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_037_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_037_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_037_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_037_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_037_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_037_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
