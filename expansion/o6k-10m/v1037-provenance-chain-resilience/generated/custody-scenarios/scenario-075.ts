import { V1037_PCRS_clamp, V1037_PCRS_provenanceChainResilienceBandFromScore } from '../../engine/provenance-chain-resilience-utils.ts';
import type {
  V1037PcresProvenanceChainResilienceBand,
  V1037PcresRegionId,
  V1037PcresCustodySnapshot,
  V1037PcresProvenanceChainResilienceChannel,
} from '../../types/core.ts';

/** Generated chain-of-custody incident scenario 075 — extreme_heat/drought/dust handoff matrix. */
export const V1037_PCRS_CUSTODY_SCENARIO_075_META = {
  id: 'custody_075',
  regionId: 'WA' as V1037PcresRegionId,
  primaryChannel: 'specialist_referral' as V1037PcresProvenanceChainResilienceChannel,
  provenanceChainResilienceBand: 'minimal' as V1037PcresProvenanceChainResilienceBand,
  seed: 68846,
} as const;

const V1037_PCRS_CUSTODY_SCENARIO_075_COEF = {
  k0: 58.3000,
  k1: 63.6000,
  k2: 68.9000,
  k3: 74.2000,
  k4: 79.5000,
  k5: 84.8000,
  k6: 90.1000,
  k7: 95.4000,
  k8: 1.0000,
  k9: 6.3000,
  k10: 11.6000,
  k11: 16.9000,
  k12: 22.2000,
  k13: 27.5000,
  k14: 32.8000,
  k15: 38.1000,
  k16: 43.4000,
  k17: 48.7000,
  k18: 54.0000,
  k19: 59.3000,
  k20: 64.6000,
  k21: 69.9000,
  k22: 75.2000,
  k23: 80.5000,
  k24: 85.8000,
  k25: 91.1000,
  k26: 96.4000,
  k27: 2.0000,
  k28: 7.3000,
  k29: 12.6000,
  k30: 17.9000,
  k31: 23.2000,
  k32: 28.5000,
  k33: 33.8000,
  k34: 39.1000,
  k35: 44.4000,
  k36: 49.7000,
  k37: 55.0000,
  k38: 60.3000,
  k39: 65.6000,
  k40: 70.9000,
  k41: 76.2000,
  k42: 81.5000,
  k43: 86.8000,
  k44: 92.1000,
  k45: 97.4000,
  k46: 3.0000,
  k47: 8.3000,
  k48: 13.6000,
  k49: 18.9000,
  k50: 24.2000,
  k51: 29.5000,
  k52: 34.8000,
  k53: 40.1000,
  k54: 45.4000,
  k55: 50.7000,
  k56: 56.0000,
  k57: 61.3000,
  k58: 66.6000,
  k59: 71.9000,
  k60: 77.2000,
  k61: 82.5000,
  k62: 87.8000,
  k63: 93.1000,
  k64: 98.4000,
  k65: 4.0000,
  k66: 9.3000,
  k67: 14.6000,
  k68: 19.9000,
  k69: 25.2000,
  k70: 30.5000,
  k71: 35.8000,
} as const;

export function V1037_PCRS_CUSTODY_SCENARIO_075_evaluate(turn: number): {
  custodyChainStressExposureIndex: number;
  custodyChainMeshDelayTurns: number;
  provenanceChainResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1037_PCRS_CUSTODY_SCENARIO_075_COEF) as Array<
    keyof typeof V1037_PCRS_CUSTODY_SCENARIO_075_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1037_PCRS_CUSTODY_SCENARIO_075_COEF[keys[j]] * ((turn + j) % 17);
  }
  const custodyChainStressExposureIndex = V1037_PCRS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const custodyChainMeshDelayTurns = V1037_PCRS_clamp(2 + (acc % 11), 1, 18);
  const provenanceChainResilienceScore = V1037_PCRS_clamp(90 - custodyChainStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1037_PCRS_provenanceChainResilienceBandFromScore(provenanceChainResilienceScore) !== 'depleted';
  return { custodyChainStressExposureIndex, custodyChainMeshDelayTurns, provenanceChainResilienceScore, stable };
}

export function V1037_PCRS_CUSTODY_SCENARIO_075_snapshot(turn: number): V1037PcresCustodySnapshot {
  const r = V1037_PCRS_CUSTODY_SCENARIO_075_evaluate(turn);
  return {
    scenarioId: V1037_PCRS_CUSTODY_SCENARIO_075_META.id,
    regionId: V1037_PCRS_CUSTODY_SCENARIO_075_META.regionId,
    provenanceChainResilienceChannel: V1037_PCRS_CUSTODY_SCENARIO_075_META.primaryChannel,
    custodyChainStressExposureIndex: r.custodyChainStressExposureIndex,
    custodyChainMeshDelayTurns: r.custodyChainMeshDelayTurns,
    provenanceChainResilienceScore: r.provenanceChainResilienceScore,
    provenanceChainResilienceBand: V1037_PCRS_provenanceChainResilienceBandFromScore(r.provenanceChainResilienceScore),
  };
}

export function V1037_PCRS_CUSTODY_SCENARIO_075_regressionAssert(turn: number): boolean {
  const r = V1037_PCRS_CUSTODY_SCENARIO_075_evaluate(turn);
  return typeof r.custodyChainStressExposureIndex === 'number' && r.provenanceChainResilienceScore <= 100;
}
