import { V1036_IIRES_clamp, V1036_IIRES_informationIntegrityResilienceBandFromScore } from '../../engine/information-integrity-resilience-utils.ts';
import type {
  V1036IiresInformationIntegrityResilienceBand,
  V1036IiresRegionId,
  V1036IiresAttestationSnapshot,
  V1036IiresInformationIntegrityResilienceChannel,
} from '../../types/core.ts';

/** Generated attestation integrity scenario 066 — extreme_heat/drought/dust handoff matrix. */
export const V1036_IIRES_ATTESTATION_SCENARIO_066_META = {
  id: 'attestation_066',
  regionId: 'QLD' as V1036IiresRegionId,
  primaryChannel: 'aged_care' as V1036IiresInformationIntegrityResilienceChannel,
  informationIntegrityResilienceBand: 'moderate' as V1036IiresInformationIntegrityResilienceBand,
  seed: 60647,
} as const;

const V1036_IIRES_ATTESTATION_SCENARIO_066_COEF = {
  k0: 12.4000,
  k1: 95.1000,
  k2: 78.1000,
  k3: 61.1000,
  k4: 44.1000,
  k5: 27.1000,
  k6: 10.1000,
  k7: 92.8000,
  k8: 75.8000,
  k9: 58.8000,
  k10: 41.8000,
  k11: 24.8000,
  k12: 7.8000,
  k13: 90.5000,
  k14: 73.5000,
  k15: 56.5000,
  k16: 39.5000,
  k17: 22.5000,
  k18: 5.5000,
  k19: 88.2000,
  k20: 71.2000,
  k21: 54.2000,
  k22: 37.2000,
  k23: 20.2000,
  k24: 3.2000,
  k25: 85.9000,
  k26: 68.9000,
  k27: 51.9000,
  k28: 34.9000,
  k29: 17.9000,
  k30: 0.9000,
  k31: 83.6000,
  k32: 66.6000,
  k33: 49.6000,
  k34: 32.6000,
  k35: 15.6000,
  k36: 98.3000,
  k37: 81.3000,
  k38: 64.3000,
  k39: 47.3000,
  k40: 30.3000,
  k41: 13.3000,
  k42: 96.0000,
  k43: 79.0000,
  k44: 62.0000,
  k45: 45.0000,
  k46: 28.0000,
  k47: 11.0000,
  k48: 93.7000,
  k49: 76.7000,
  k50: 59.7000,
  k51: 42.7000,
  k52: 25.7000,
  k53: 8.7000,
  k54: 91.4000,
  k55: 74.4000,
  k56: 57.4000,
  k57: 40.4000,
  k58: 23.4000,
  k59: 6.4000,
  k60: 89.1000,
  k61: 72.1000,
  k62: 55.1000,
  k63: 38.1000,
  k64: 21.1000,
  k65: 4.1000,
  k66: 86.8000,
  k67: 69.8000,
  k68: 52.8000,
  k69: 35.8000,
  k70: 18.8000,
  k71: 1.8000,
} as const;

export function V1036_IIRES_ATTESTATION_SCENARIO_066_evaluate(turn: number): {
  attestationMeshStressExposureIndex: number;
  attestationMeshDelayTurns: number;
  informationIntegrityResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1036_IIRES_ATTESTATION_SCENARIO_066_COEF) as Array<
    keyof typeof V1036_IIRES_ATTESTATION_SCENARIO_066_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1036_IIRES_ATTESTATION_SCENARIO_066_COEF[keys[j]] * ((turn + j) % 17);
  }
  const attestationMeshStressExposureIndex = V1036_IIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const attestationMeshDelayTurns = V1036_IIRES_clamp(2 + (acc % 11), 1, 18);
  const informationIntegrityResilienceScore = V1036_IIRES_clamp(90 - attestationMeshStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1036_IIRES_informationIntegrityResilienceBandFromScore(informationIntegrityResilienceScore) !== 'depleted';
  return { attestationMeshStressExposureIndex, attestationMeshDelayTurns, informationIntegrityResilienceScore, stable };
}

export function V1036_IIRES_ATTESTATION_SCENARIO_066_snapshot(turn: number): V1036IiresAttestationSnapshot {
  const r = V1036_IIRES_ATTESTATION_SCENARIO_066_evaluate(turn);
  return {
    scenarioId: V1036_IIRES_ATTESTATION_SCENARIO_066_META.id,
    regionId: V1036_IIRES_ATTESTATION_SCENARIO_066_META.regionId,
    informationIntegrityResilienceChannel: V1036_IIRES_ATTESTATION_SCENARIO_066_META.primaryChannel,
    attestationMeshStressExposureIndex: r.attestationMeshStressExposureIndex,
    attestationMeshDelayTurns: r.attestationMeshDelayTurns,
    informationIntegrityResilienceScore: r.informationIntegrityResilienceScore,
    informationIntegrityResilienceBand: V1036_IIRES_informationIntegrityResilienceBandFromScore(r.informationIntegrityResilienceScore),
  };
}

export function V1036_IIRES_ATTESTATION_SCENARIO_066_regressionAssert(turn: number): boolean {
  const r = V1036_IIRES_ATTESTATION_SCENARIO_066_evaluate(turn);
  return typeof r.attestationMeshStressExposureIndex === 'number' && r.informationIntegrityResilienceScore <= 100;
}
