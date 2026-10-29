import { V1037_PCRS_clamp, V1037_PCRS_provenanceChainResilienceBandFromScore } from '../../engine/provenance-chain-resilience-utils.ts';
import type {
  V1037PcresProvenanceChainResilienceBand,
  V1037PcresRegionId,
  V1037PcresCustodySnapshot,
  V1037PcresProvenanceChainResilienceChannel,
} from '../../types/core.ts';

/** Generated chain-of-custody incident scenario 024 — extreme_heat/drought/dust handoff matrix. */
export const V1037_PCRS_CUSTODY_SCENARIO_024_META = {
  id: 'custody_024',
  regionId: 'NSW' as V1037PcresRegionId,
  primaryChannel: 'rural_clinic' as V1037PcresProvenanceChainResilienceChannel,
  provenanceChainResilienceBand: 'recovering' as V1037PcresProvenanceChainResilienceBand,
  seed: 22385,
} as const;

const V1037_PCRS_CUSTODY_SCENARIO_024_COEF = {
  k0: 97.3000,
  k1: 42.7000,
  k2: 87.8000,
  k3: 33.2000,
  k4: 78.3000,
  k5: 23.7000,
  k6: 68.8000,
  k7: 14.2000,
  k8: 59.3000,
  k9: 4.7000,
  k10: 49.8000,
  k11: 94.9000,
  k12: 40.3000,
  k13: 85.4000,
  k14: 30.8000,
  k15: 75.9000,
  k16: 21.3000,
  k17: 66.4000,
  k18: 11.8000,
  k19: 56.9000,
  k20: 2.3000,
  k21: 47.4000,
  k22: 92.5000,
  k23: 37.9000,
  k24: 83.0000,
  k25: 28.4000,
  k26: 73.5000,
  k27: 18.9000,
  k28: 64.0000,
  k29: 9.4000,
  k30: 54.5000,
  k31: 99.6000,
  k32: 45.0000,
  k33: 90.1000,
  k34: 35.5000,
  k35: 80.6000,
  k36: 26.0000,
  k37: 71.1000,
  k38: 16.5000,
  k39: 61.6000,
  k40: 7.0000,
  k41: 52.1000,
  k42: 97.2000,
  k43: 42.6000,
  k44: 87.7000,
  k45: 33.1000,
  k46: 78.2000,
  k47: 23.6000,
  k48: 68.7000,
  k49: 14.1000,
  k50: 59.2000,
  k51: 4.6000,
  k52: 49.7000,
  k53: 94.8000,
  k54: 40.2000,
  k55: 85.3000,
  k56: 30.7000,
  k57: 75.8000,
  k58: 21.2000,
  k59: 66.3000,
  k60: 11.7000,
  k61: 56.8000,
  k62: 2.2000,
  k63: 47.3000,
  k64: 92.4000,
  k65: 37.8000,
  k66: 82.9000,
  k67: 28.3000,
  k68: 73.4000,
  k69: 18.8000,
  k70: 63.9000,
  k71: 9.3000,
} as const;

export function V1037_PCRS_CUSTODY_SCENARIO_024_evaluate(turn: number): {
  custodyChainStressExposureIndex: number;
  custodyChainMeshDelayTurns: number;
  provenanceChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1037_PCRS_CUSTODY_SCENARIO_024_COEF) as Array<
    keyof typeof V1037_PCRS_CUSTODY_SCENARIO_024_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1037_PCRS_CUSTODY_SCENARIO_024_COEF[keys[j]] * ((turn + j) % 17);
  }
  const custodyChainStressExposureIndex = V1037_PCRS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const custodyChainMeshDelayTurns = V1037_PCRS_clamp(2 + (acc % 11), 1, 18);
  const provenanceChainResilienceScore = V1037_PCRS_clamp(90 - custodyChainStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1037_PCRS_provenanceChainResilienceBandFromScore(provenanceChainResilienceScore) !== 'depleted';
  return { custodyChainStressExposureIndex, custodyChainMeshDelayTurns, provenanceChainResilienceScore, stable };
}

export function V1037_PCRS_CUSTODY_SCENARIO_024_snapshot(turn: number): V1037PcresCustodySnapshot {
  const r = V1037_PCRS_CUSTODY_SCENARIO_024_evaluate(turn);
  return {
    scenarioId: V1037_PCRS_CUSTODY_SCENARIO_024_META.id,
    regionId: V1037_PCRS_CUSTODY_SCENARIO_024_META.regionId,
    provenanceChainResilienceChannel: V1037_PCRS_CUSTODY_SCENARIO_024_META.primaryChannel,
    custodyChainStressExposureIndex: r.custodyChainStressExposureIndex,
    custodyChainMeshDelayTurns: r.custodyChainMeshDelayTurns,
    provenanceChainResilienceScore: r.provenanceChainResilienceScore,
    provenanceChainResilienceBand: V1037_PCRS_provenanceChainResilienceBandFromScore(r.provenanceChainResilienceScore),
  };
}

export function V1037_PCRS_CUSTODY_SCENARIO_024_regressionAssert(turn: number): boolean {
  const r = V1037_PCRS_CUSTODY_SCENARIO_024_evaluate(turn);
  return typeof r.custodyChainStressExposureIndex === 'number' && r.provenanceChainResilienceScore <= 100;
}
