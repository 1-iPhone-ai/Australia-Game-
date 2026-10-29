import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 086 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_086_META = {
  id: 'disruption_086',
  regionId: 'NT' as V1033ScresRegionId,
  primaryChannel: 'aged_care' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'moderate' as V1033ScresSupplyChainResilienceBand,
  seed: 78867,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_086_COEF = {
  k0: 14.7000,
  k1: 25.1000,
  k2: 35.5000,
  k3: 45.9000,
  k4: 56.3000,
  k5: 66.7000,
  k6: 77.1000,
  k7: 87.5000,
  k8: 97.9000,
  k9: 8.6000,
  k10: 19.0000,
  k11: 29.4000,
  k12: 39.8000,
  k13: 50.2000,
  k14: 60.6000,
  k15: 71.0000,
  k16: 81.4000,
  k17: 91.8000,
  k18: 2.5000,
  k19: 12.9000,
  k20: 23.3000,
  k21: 33.7000,
  k22: 44.1000,
  k23: 54.5000,
  k24: 64.9000,
  k25: 75.3000,
  k26: 85.7000,
  k27: 96.1000,
  k28: 6.8000,
  k29: 17.2000,
  k30: 27.6000,
  k31: 38.0000,
  k32: 48.4000,
  k33: 58.8000,
  k34: 69.2000,
  k35: 79.6000,
  k36: 90.0000,
  k37: 0.7000,
  k38: 11.1000,
  k39: 21.5000,
  k40: 31.9000,
  k41: 42.3000,
  k42: 52.7000,
  k43: 63.1000,
  k44: 73.5000,
  k45: 83.9000,
  k46: 94.3000,
  k47: 5.0000,
  k48: 15.4000,
  k49: 25.8000,
  k50: 36.2000,
  k51: 46.6000,
  k52: 57.0000,
  k53: 67.4000,
  k54: 77.8000,
  k55: 88.2000,
  k56: 98.6000,
  k57: 9.3000,
  k58: 19.7000,
  k59: 30.1000,
  k60: 40.5000,
  k61: 50.9000,
  k62: 61.3000,
  k63: 71.7000,
  k64: 82.1000,
  k65: 92.5000,
  k66: 3.2000,
  k67: 13.6000,
  k68: 24.0000,
  k69: 34.4000,
  k70: 44.8000,
  k71: 55.2000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_086_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_086_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_086_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_086_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_086_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_086_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_086_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_086_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_086_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_086_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_086_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_086_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
