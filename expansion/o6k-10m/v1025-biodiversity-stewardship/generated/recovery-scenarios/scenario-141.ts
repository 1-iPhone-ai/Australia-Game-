import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 141 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_141_META = {
  id: 'stress_141',
  regionId: 'TAS' as V1025BioRegionId,
  primaryChannel: 'habitat_connectivity' as V1025BioStewardshipChannel,
  stewardshipBand: 'moderate' as V1025BioStewardshipBand,
  seed: 128972,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_141_COEF = {
  k0: 95.8000,
  k1: 32.0000,
  k2: 67.9000,
  k3: 4.1000,
  k4: 40.0000,
  k5: 75.9000,
  k6: 12.1000,
  k7: 48.0000,
  k8: 83.9000,
  k9: 20.1000,
  k10: 56.0000,
  k11: 91.9000,
  k12: 28.1000,
  k13: 64.0000,
  k14: 0.2000,
  k15: 36.1000,
  k16: 72.0000,
  k17: 8.2000,
  k18: 44.1000,
  k19: 80.0000,
  k20: 16.2000,
  k21: 52.1000,
  k22: 88.0000,
  k23: 24.2000,
  k24: 60.1000,
  k25: 96.0000,
  k26: 32.2000,
  k27: 68.1000,
  k28: 4.3000,
  k29: 40.2000,
  k30: 76.1000,
  k31: 12.3000,
  k32: 48.2000,
  k33: 84.1000,
  k34: 20.3000,
  k35: 56.2000,
  k36: 92.1000,
  k37: 28.3000,
  k38: 64.2000,
  k39: 0.4000,
  k40: 36.3000,
  k41: 72.2000,
  k42: 8.4000,
  k43: 44.3000,
  k44: 80.2000,
  k45: 16.4000,
  k46: 52.3000,
  k47: 88.2000,
  k48: 24.4000,
  k49: 60.3000,
  k50: 96.2000,
  k51: 32.4000,
  k52: 68.3000,
  k53: 4.5000,
  k54: 40.4000,
  k55: 76.3000,
  k56: 12.5000,
  k57: 48.4000,
  k58: 84.3000,
  k59: 20.5000,
  k60: 56.4000,
  k61: 92.3000,
  k62: 28.5000,
  k63: 64.4000,
  k64: 0.6000,
  k65: 36.5000,
  k66: 72.4000,
  k67: 8.6000,
  k68: 44.5000,
  k69: 80.4000,
  k70: 16.6000,
  k71: 52.5000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_141_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_141_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_141_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_141_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_141_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_141_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_141_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_141_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_141_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_141_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_141_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_141_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
