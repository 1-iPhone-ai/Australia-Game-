import { V1033_SCRES_clamp, V1033_SCRES_supplyChainResilienceBandFromScore } from '../../engine/supply-chain-resilience-utils.ts';
import type {
  V1033ScresSupplyChainResilienceBand,
  V1033ScresRegionId,
  V1033ScresDisruptionSnapshot,
  V1033ScresSupplyChainResilienceChannel,
} from '../../types/core.ts';

/** Generated disruption scenario 093 — extreme_heat/drought/dust handoff matrix. */
export const V1033_SCRES_DISRUPTION_SCENARIO_093_META = {
  id: 'disruption_093',
  regionId: 'TAS' as V1033ScresRegionId,
  primaryChannel: 'telehealth' as V1033ScresSupplyChainResilienceChannel,
  supplyChainResilienceBand: 'critical' as V1033ScresSupplyChainResilienceBand,
  seed: 85244,
} as const;

const V1033_SCRES_DISRUPTION_SCENARIO_093_COEF = {
  k0: 50.4000,
  k1: 0.6000,
  k2: 50.5000,
  k3: 0.7000,
  k4: 50.6000,
  k5: 0.8000,
  k6: 50.7000,
  k7: 0.9000,
  k8: 50.8000,
  k9: 1.0000,
  k10: 50.9000,
  k11: 1.1000,
  k12: 51.0000,
  k13: 1.2000,
  k14: 51.1000,
  k15: 1.3000,
  k16: 51.2000,
  k17: 1.4000,
  k18: 51.3000,
  k19: 1.5000,
  k20: 51.4000,
  k21: 1.6000,
  k22: 51.5000,
  k23: 1.7000,
  k24: 51.6000,
  k25: 1.8000,
  k26: 51.7000,
  k27: 1.9000,
  k28: 51.8000,
  k29: 2.0000,
  k30: 51.9000,
  k31: 2.1000,
  k32: 52.0000,
  k33: 2.2000,
  k34: 52.1000,
  k35: 2.3000,
  k36: 52.2000,
  k37: 2.4000,
  k38: 52.3000,
  k39: 2.5000,
  k40: 52.4000,
  k41: 2.6000,
  k42: 52.5000,
  k43: 2.7000,
  k44: 52.6000,
  k45: 2.8000,
  k46: 52.7000,
  k47: 2.9000,
  k48: 52.8000,
  k49: 3.0000,
  k50: 52.9000,
  k51: 3.1000,
  k52: 53.0000,
  k53: 3.2000,
  k54: 53.1000,
  k55: 3.3000,
  k56: 53.2000,
  k57: 3.4000,
  k58: 53.3000,
  k59: 3.5000,
  k60: 53.4000,
  k61: 3.6000,
  k62: 53.5000,
  k63: 3.7000,
  k64: 53.6000,
  k65: 3.8000,
  k66: 53.7000,
  k67: 3.9000,
  k68: 53.8000,
  k69: 4.0000,
  k70: 53.9000,
  k71: 4.1000,
} as const;

export function V1033_SCRES_DISRUPTION_SCENARIO_093_evaluate(turn: number): {
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1033_SCRES_DISRUPTION_SCENARIO_093_COEF) as Array<
    keyof typeof V1033_SCRES_DISRUPTION_SCENARIO_093_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1033_SCRES_DISRUPTION_SCENARIO_093_COEF[keys[j]] * ((turn + j) % 17);
  }
  const logisticsStressExposureIndex = V1033_SCRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const corridorBufferDelayTurns = V1033_SCRES_clamp(2 + (acc % 11), 1, 18);
  const supplyChainResilienceScore = V1033_SCRES_clamp(90 - logisticsStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1033_SCRES_supplyChainResilienceBandFromScore(supplyChainResilienceScore) !== 'depleted';
  return { logisticsStressExposureIndex, corridorBufferDelayTurns, supplyChainResilienceScore, stable };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_093_snapshot(turn: number): V1033ScresDisruptionSnapshot {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_093_evaluate(turn);
  return {
    scenarioId: V1033_SCRES_DISRUPTION_SCENARIO_093_META.id,
    regionId: V1033_SCRES_DISRUPTION_SCENARIO_093_META.regionId,
    supplyChainResilienceChannel: V1033_SCRES_DISRUPTION_SCENARIO_093_META.primaryChannel,
    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_093_META.supplyChainResilienceBand,
    logisticsStressExposureIndex: r.logisticsStressExposureIndex,
    corridorBufferDelayTurns: r.corridorBufferDelayTurns,
    supplyChainResilienceScore: r.supplyChainResilienceScore,
    supplyChainResilienceBand: V1033_SCRES_supplyChainResilienceBandFromScore(r.supplyChainResilienceScore),
  };
}

export function V1033_SCRES_DISRUPTION_SCENARIO_093_regressionAssert(turn: number): boolean {
  const r = V1033_SCRES_DISRUPTION_SCENARIO_093_evaluate(turn);
  return typeof r.logisticsStressExposureIndex === 'number' && r.supplyChainResilienceScore <= 100;
}
