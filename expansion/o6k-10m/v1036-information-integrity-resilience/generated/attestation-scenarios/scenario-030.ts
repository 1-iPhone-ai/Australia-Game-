import { V1036_IIRES_clamp, V1036_IIRES_informationIntegrityResilienceBandFromScore } from '../../engine/information-integrity-resilience-utils.ts';
import type {
  V1036IiresInformationIntegrityResilienceBand,
  V1036IiresRegionId,
  V1036IiresAttestationSnapshot,
  V1036IiresInformationIntegrityResilienceChannel,
} from '../../types/core.ts';

/** Generated attestation integrity scenario 030 — extreme_heat/drought/dust handoff matrix. */
export const V1036_IIRES_ATTESTATION_SCENARIO_030_META = {
  id: 'attestation_030',
  regionId: 'NT' as V1036IiresRegionId,
  primaryChannel: 'emergency_care' as V1036IiresInformationIntegrityResilienceChannel,
  informationIntegrityResilienceBand: 'minimal' as V1036IiresInformationIntegrityResilienceBand,
  seed: 27851,
} as const;

const V1036_IIRES_ATTESTATION_SCENARIO_030_COEF = {
  k0: 28.2000,
  k1: 21.7000,
  k2: 15.2000,
  k3: 8.7000,
  k4: 2.2000,
  k5: 95.4000,
  k6: 88.9000,
  k7: 82.4000,
  k8: 75.9000,
  k9: 69.4000,
  k10: 62.9000,
  k11: 56.4000,
  k12: 49.9000,
  k13: 43.4000,
  k14: 36.9000,
  k15: 30.4000,
  k16: 23.9000,
  k17: 17.4000,
  k18: 10.9000,
  k19: 4.4000,
  k20: 97.6000,
  k21: 91.1000,
  k22: 84.6000,
  k23: 78.1000,
  k24: 71.6000,
  k25: 65.1000,
  k26: 58.6000,
  k27: 52.1000,
  k28: 45.6000,
  k29: 39.1000,
  k30: 32.6000,
  k31: 26.1000,
  k32: 19.6000,
  k33: 13.1000,
  k34: 6.6000,
  k35: 0.1000,
  k36: 93.3000,
  k37: 86.8000,
  k38: 80.3000,
  k39: 73.8000,
  k40: 67.3000,
  k41: 60.8000,
  k42: 54.3000,
  k43: 47.8000,
  k44: 41.3000,
  k45: 34.8000,
  k46: 28.3000,
  k47: 21.8000,
  k48: 15.3000,
  k49: 8.8000,
  k50: 2.3000,
  k51: 95.5000,
  k52: 89.0000,
  k53: 82.5000,
  k54: 76.0000,
  k55: 69.5000,
  k56: 63.0000,
  k57: 56.5000,
  k58: 50.0000,
  k59: 43.5000,
  k60: 37.0000,
  k61: 30.5000,
  k62: 24.0000,
  k63: 17.5000,
  k64: 11.0000,
  k65: 4.5000,
  k66: 97.7000,
  k67: 91.2000,
  k68: 84.7000,
  k69: 78.2000,
  k70: 71.7000,
  k71: 65.2000,
} as const;

export function V1036_IIRES_ATTESTATION_SCENARIO_030_evaluate(turn: number): {
  attestationMeshStressExposureIndex: number;
  attestationMeshDelayTurns: number;
  informationIntegrityResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1036_IIRES_ATTESTATION_SCENARIO_030_COEF) as Array<
    keyof typeof V1036_IIRES_ATTESTATION_SCENARIO_030_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1036_IIRES_ATTESTATION_SCENARIO_030_COEF[keys[j]] * ((turn + j) % 17);
  }
  const attestationMeshStressExposureIndex = V1036_IIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const attestationMeshDelayTurns = V1036_IIRES_clamp(2 + (acc % 11), 1, 18);
  const informationIntegrityResilienceScore = V1036_IIRES_clamp(90 - attestationMeshStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1036_IIRES_informationIntegrityResilienceBandFromScore(informationIntegrityResilienceScore) !== 'depleted';
  return { attestationMeshStressExposureIndex, attestationMeshDelayTurns, informationIntegrityResilienceScore, stable };
}

export function V1036_IIRES_ATTESTATION_SCENARIO_030_snapshot(turn: number): V1036IiresAttestationSnapshot {
  const r = V1036_IIRES_ATTESTATION_SCENARIO_030_evaluate(turn);
  return {
    scenarioId: V1036_IIRES_ATTESTATION_SCENARIO_030_META.id,
    regionId: V1036_IIRES_ATTESTATION_SCENARIO_030_META.regionId,
    informationIntegrityResilienceChannel: V1036_IIRES_ATTESTATION_SCENARIO_030_META.primaryChannel,
    attestationMeshStressExposureIndex: r.attestationMeshStressExposureIndex,
    attestationMeshDelayTurns: r.attestationMeshDelayTurns,
    informationIntegrityResilienceScore: r.informationIntegrityResilienceScore,
    informationIntegrityResilienceBand: V1036_IIRES_informationIntegrityResilienceBandFromScore(r.informationIntegrityResilienceScore),
  };
}

export function V1036_IIRES_ATTESTATION_SCENARIO_030_regressionAssert(turn: number): boolean {
  const r = V1036_IIRES_ATTESTATION_SCENARIO_030_evaluate(turn);
  return typeof r.attestationMeshStressExposureIndex === 'number' && r.informationIntegrityResilienceScore <= 100;
}
