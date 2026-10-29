import { V1037_PCRS_clamp, V1037_PCRS_provenanceChainResilienceBandFromScore } from '../../engine/provenance-chain-resilience-utils.ts';
import type {
  V1037PcresProvenanceChainResilienceBand,
  V1037PcresRegionId,
  V1037PcresCustodySnapshot,
  V1037PcresProvenanceChainResilienceChannel,
} from '../../types/core.ts';

/** Generated chain-of-custody incident scenario 051 — extreme_heat/drought/dust handoff matrix. */
export const V1037_PCRS_CUSTODY_SCENARIO_051_META = {
  id: 'custody_051',
  regionId: 'WA' as V1037PcresRegionId,
  primaryChannel: 'primary_access' as V1037PcresProvenanceChainResilienceChannel,
  provenanceChainResilienceBand: 'moderate' as V1037PcresProvenanceChainResilienceBand,
  seed: 46982,
} as const;

const V1037_PCRS_CUSTODY_SCENARIO_051_COEF = {
  k0: 35.6000,
  k1: 47.9000,
  k2: 60.2000,
  k3: 72.5000,
  k4: 84.8000,
  k5: 97.1000,
  k6: 9.7000,
  k7: 22.0000,
  k8: 34.3000,
  k9: 46.6000,
  k10: 58.9000,
  k11: 71.2000,
  k12: 83.5000,
  k13: 95.8000,
  k14: 8.4000,
  k15: 20.7000,
  k16: 33.0000,
  k17: 45.3000,
  k18: 57.6000,
  k19: 69.9000,
  k20: 82.2000,
  k21: 94.5000,
  k22: 7.1000,
  k23: 19.4000,
  k24: 31.7000,
  k25: 44.0000,
  k26: 56.3000,
  k27: 68.6000,
  k28: 80.9000,
  k29: 93.2000,
  k30: 5.8000,
  k31: 18.1000,
  k32: 30.4000,
  k33: 42.7000,
  k34: 55.0000,
  k35: 67.3000,
  k36: 79.6000,
  k37: 91.9000,
  k38: 4.5000,
  k39: 16.8000,
  k40: 29.1000,
  k41: 41.4000,
  k42: 53.7000,
  k43: 66.0000,
  k44: 78.3000,
  k45: 90.6000,
  k46: 3.2000,
  k47: 15.5000,
  k48: 27.8000,
  k49: 40.1000,
  k50: 52.4000,
  k51: 64.7000,
  k52: 77.0000,
  k53: 89.3000,
  k54: 1.9000,
  k55: 14.2000,
  k56: 26.5000,
  k57: 38.8000,
  k58: 51.1000,
  k59: 63.4000,
  k60: 75.7000,
  k61: 88.0000,
  k62: 0.6000,
  k63: 12.9000,
  k64: 25.2000,
  k65: 37.5000,
  k66: 49.8000,
  k67: 62.1000,
  k68: 74.4000,
  k69: 86.7000,
  k70: 99.0000,
  k71: 11.6000,
} as const;

export function V1037_PCRS_CUSTODY_SCENARIO_051_evaluate(turn: number): {
  custodyChainStressExposureIndex: number;
  custodyChainMeshDelayTurns: number;
  provenanceChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1037_PCRS_CUSTODY_SCENARIO_051_COEF) as Array<
    keyof typeof V1037_PCRS_CUSTODY_SCENARIO_051_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1037_PCRS_CUSTODY_SCENARIO_051_COEF[keys[j]] * ((turn + j) % 17);
  }
  const custodyChainStressExposureIndex = V1037_PCRS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const custodyChainMeshDelayTurns = V1037_PCRS_clamp(2 + (acc % 11), 1, 18);
  const provenanceChainResilienceScore = V1037_PCRS_clamp(90 - custodyChainStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1037_PCRS_provenanceChainResilienceBandFromScore(provenanceChainResilienceScore) !== 'depleted';
  return { custodyChainStressExposureIndex, custodyChainMeshDelayTurns, provenanceChainResilienceScore, stable };
}

export function V1037_PCRS_CUSTODY_SCENARIO_051_snapshot(turn: number): V1037PcresCustodySnapshot {
  const r = V1037_PCRS_CUSTODY_SCENARIO_051_evaluate(turn);
  return {
    scenarioId: V1037_PCRS_CUSTODY_SCENARIO_051_META.id,
    regionId: V1037_PCRS_CUSTODY_SCENARIO_051_META.regionId,
    provenanceChainResilienceChannel: V1037_PCRS_CUSTODY_SCENARIO_051_META.primaryChannel,
    custodyChainStressExposureIndex: r.custodyChainStressExposureIndex,
    custodyChainMeshDelayTurns: r.custodyChainMeshDelayTurns,
    provenanceChainResilienceScore: r.provenanceChainResilienceScore,
    provenanceChainResilienceBand: V1037_PCRS_provenanceChainResilienceBandFromScore(r.provenanceChainResilienceScore),
  };
}

export function V1037_PCRS_CUSTODY_SCENARIO_051_regressionAssert(turn: number): boolean {
  const r = V1037_PCRS_CUSTODY_SCENARIO_051_evaluate(turn);
  return typeof r.custodyChainStressExposureIndex === 'number' && r.provenanceChainResilienceScore <= 100;
}
