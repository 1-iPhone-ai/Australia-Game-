import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 150 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_150_META = {
  id: 'disruption_150',
  regionId: 'NT' as V1033ScresRegionId,
  primaryChannel: 'emergency_care' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'minimal' as V1033ScresSupplyChainResilienceBand,
  seed: 137171,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_150_COEF = {
  k0: 42.0000,
  k1: 0.5000,
  k2: 58.7000,
  k3: 17.2000,
  k4: 75.4000,
  k5: 33.9000,
  k6: 92.1000,
  k7: 50.6000,
  k8: 9.1000,
  k9: 67.3000,
  k10: 25.8000,
  k11: 84.0000,
  k12: 42.5000,
  k13: 1.0000,
  k14: 59.2000,
  k15: 17.7000,
  k16: 75.9000,
  k17: 34.4000,
  k18: 92.6000,
  k19: 51.1000,
  k20: 9.6000,
  k21: 67.8000,
  k22: 26.3000,
  k23: 84.5000,
  k24: 43.0000,
  k25: 1.5000,
  k26: 59.7000,
  k27: 18.2000,
  k28: 76.4000,
  k29: 34.9000,
  k30: 93.1000,
  k31: 51.6000,
  k32: 10.1000,
  k33: 68.3000,
  k34: 26.8000,
  k35: 85.0000,
  k36: 43.5000,
  k37: 2.0000,
  k38: 60.2000,
  k39: 18.7000,
  k40: 76.9000,
  k41: 35.4000,
  k42: 93.6000,
  k43: 52.1000,
  k44: 10.6000,
  k45: 68.8000,
  k46: 27.3000,
  k47: 85.5000,
  k48: 44.0000,
  k49: 2.5000,
  k50: 60.7000,
  k51: 19.2000,
  k52: 77.4000,
  k53: 35.9000,
  k54: 94.1000,
  k55: 52.6000,
  k56: 11.1000,
  k57: 69.3000,
  k58: 27.8000,
  k59: 86.0000,
  k60: 44.5000,
  k61: 3.0000,
  k62: 61.2000,
  k63: 19.7000,
  k64: 77.9000,
  k65: 36.4000,
  k66: 94.6000,
  k67: 53.1000,
  k68: 11.6000,
  k69: 69.8000,
  k70: 28.3000,
  k71: 86.5000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_150_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_150_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_150_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_150_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_150_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_150_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_150_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_150_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_150_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_150_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_150_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_150_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
