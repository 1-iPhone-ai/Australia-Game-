import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 081 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_081_META = {
  id: 'stress_081',
  regionId: 'VIC' as V1025BioRegionId,
  primaryChannel: 'habitat_connectivity' as V1025BioStewardshipChannel,
  stewardshipBand: 'moderate' as V1025BioStewardshipBand,
  seed: 74312,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_081_COEF = {
  k0: 88.9000,
  k1: 42.6000,
  k2: 96.0000,
  k3: 49.7000,
  k4: 3.4000,
  k5: 56.8000,
  k6: 10.5000,
  k7: 63.9000,
  k8: 17.6000,
  k9: 71.0000,
  k10: 24.7000,
  k11: 78.1000,
  k12: 31.8000,
  k13: 85.2000,
  k14: 38.9000,
  k15: 92.3000,
  k16: 46.0000,
  k17: 99.4000,
  k18: 53.1000,
  k19: 6.8000,
  k20: 60.2000,
  k21: 13.9000,
  k22: 67.3000,
  k23: 21.0000,
  k24: 74.4000,
  k25: 28.1000,
  k26: 81.5000,
  k27: 35.2000,
  k28: 88.6000,
  k29: 42.3000,
  k30: 95.7000,
  k31: 49.4000,
  k32: 3.1000,
  k33: 56.5000,
  k34: 10.2000,
  k35: 63.6000,
  k36: 17.3000,
  k37: 70.7000,
  k38: 24.4000,
  k39: 77.8000,
  k40: 31.5000,
  k41: 84.9000,
  k42: 38.6000,
  k43: 92.0000,
  k44: 45.7000,
  k45: 99.1000,
  k46: 52.8000,
  k47: 6.5000,
  k48: 59.9000,
  k49: 13.6000,
  k50: 67.0000,
  k51: 20.7000,
  k52: 74.1000,
  k53: 27.8000,
  k54: 81.2000,
  k55: 34.9000,
  k56: 88.3000,
  k57: 42.0000,
  k58: 95.4000,
  k59: 49.1000,
  k60: 2.8000,
  k61: 56.2000,
  k62: 9.9000,
  k63: 63.3000,
  k64: 17.0000,
  k65: 70.4000,
  k66: 24.1000,
  k67: 77.5000,
  k68: 31.2000,
  k69: 84.6000,
  k70: 38.3000,
  k71: 91.7000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_081_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_081_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_081_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_081_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_081_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_081_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_081_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_081_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_081_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_081_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_081_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_081_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
