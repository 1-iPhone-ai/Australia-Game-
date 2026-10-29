import { V1037_PCRS_clamp, V1037_PCRS_provenanceChainResilienceBandFromScore } from '../../engine/provenance-chain-resilience-utils.ts';
import type {
  V1037PcresProvenanceChainResilienceBand,
  V1037PcresRegionId,
  V1037PcresCustodySnapshot,
  V1037PcresProvenanceChainResilienceChannel,
} from '../../types/core.ts';

/** Generated chain-of-custody incident scenario 120 — extreme_heat/drought/dust handoff matrix. */
export const V1037_PCRS_CUSTODY_SCENARIO_120_META = {
  id: 'custody_120',
  regionId: 'NSW' as V1037PcresRegionId,
  primaryChannel: 'emergency_care' as V1037PcresProvenanceChainResilienceChannel,
  provenanceChainResilienceBand: 'minimal' as V1037PcresProvenanceChainResilienceBand,
  seed: 109841,
} as const;

const V1037_PCRS_CUSTODY_SCENARIO_120_COEF = {
  k0: 88.4000,
  k1: 5.8000,
  k2: 22.9000,
  k3: 40.0000,
  k4: 57.1000,
  k5: 74.2000,
  k6: 91.3000,
  k7: 8.7000,
  k8: 25.8000,
  k9: 42.9000,
  k10: 60.0000,
  k11: 77.1000,
  k12: 94.2000,
  k13: 11.6000,
  k14: 28.7000,
  k15: 45.8000,
  k16: 62.9000,
  k17: 80.0000,
  k18: 97.1000,
  k19: 14.5000,
  k20: 31.6000,
  k21: 48.7000,
  k22: 65.8000,
  k23: 82.9000,
  k24: 0.3000,
  k25: 17.4000,
  k26: 34.5000,
  k27: 51.6000,
  k28: 68.7000,
  k29: 85.8000,
  k30: 3.2000,
  k31: 20.3000,
  k32: 37.4000,
  k33: 54.5000,
  k34: 71.6000,
  k35: 88.7000,
  k36: 6.1000,
  k37: 23.2000,
  k38: 40.3000,
  k39: 57.4000,
  k40: 74.5000,
  k41: 91.6000,
  k42: 9.0000,
  k43: 26.1000,
  k44: 43.2000,
  k45: 60.3000,
  k46: 77.4000,
  k47: 94.5000,
  k48: 11.9000,
  k49: 29.0000,
  k50: 46.1000,
  k51: 63.2000,
  k52: 80.3000,
  k53: 97.4000,
  k54: 14.8000,
  k55: 31.9000,
  k56: 49.0000,
  k57: 66.1000,
  k58: 83.2000,
  k59: 0.6000,
  k60: 17.7000,
  k61: 34.8000,
  k62: 51.9000,
  k63: 69.0000,
  k64: 86.1000,
  k65: 3.5000,
  k66: 20.6000,
  k67: 37.7000,
  k68: 54.8000,
  k69: 71.9000,
  k70: 89.0000,
  k71: 6.4000,
} as const;

export function V1037_PCRS_CUSTODY_SCENARIO_120_evaluate(turn: number): {
  custodyChainStressExposureIndex: number;
  custodyChainMeshDelayTurns: number;
  provenanceChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1037_PCRS_CUSTODY_SCENARIO_120_COEF) as Array<
    keyof typeof V1037_PCRS_CUSTODY_SCENARIO_120_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1037_PCRS_CUSTODY_SCENARIO_120_COEF[keys[j]] * ((turn + j) % 17);
  }
  const custodyChainStressExposureIndex = V1037_PCRS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const custodyChainMeshDelayTurns = V1037_PCRS_clamp(2 + (acc % 11), 1, 18);
  const provenanceChainResilienceScore = V1037_PCRS_clamp(90 - custodyChainStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1037_PCRS_provenanceChainResilienceBandFromScore(provenanceChainResilienceScore) !== 'depleted';
  return { custodyChainStressExposureIndex, custodyChainMeshDelayTurns, provenanceChainResilienceScore, stable };
}

export function V1037_PCRS_CUSTODY_SCENARIO_120_snapshot(turn: number): V1037PcresCustodySnapshot {
  const r = V1037_PCRS_CUSTODY_SCENARIO_120_evaluate(turn);
  return {
    scenarioId: V1037_PCRS_CUSTODY_SCENARIO_120_META.id,
    regionId: V1037_PCRS_CUSTODY_SCENARIO_120_META.regionId,
    provenanceChainResilienceChannel: V1037_PCRS_CUSTODY_SCENARIO_120_META.primaryChannel,
    custodyChainStressExposureIndex: r.custodyChainStressExposureIndex,
    custodyChainMeshDelayTurns: r.custodyChainMeshDelayTurns,
    provenanceChainResilienceScore: r.provenanceChainResilienceScore,
    provenanceChainResilienceBand: V1037_PCRS_provenanceChainResilienceBandFromScore(r.provenanceChainResilienceScore),
  };
}

export function V1037_PCRS_CUSTODY_SCENARIO_120_regressionAssert(turn: number): boolean {
  const r = V1037_PCRS_CUSTODY_SCENARIO_120_evaluate(turn);
  return typeof r.custodyChainStressExposureIndex === 'number' && r.provenanceChainResilienceScore <= 100;
}
