import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 060 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_060_META = {
  id: 'stress_060',
  regionId: 'SA' as V1025BioRegionId,
  primaryChannel: 'species_recovery' as V1025BioStewardshipChannel,
  stewardshipBand: 'minimal' as V1025BioStewardshipBand,
  seed: 55181,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_060_COEF = {
  k0: 81.5000,
  k1: 16.4000,
  k2: 51.0000,
  k3: 85.6000,
  k4: 20.5000,
  k5: 55.1000,
  k6: 89.7000,
  k7: 24.6000,
  k8: 59.2000,
  k9: 93.8000,
  k10: 28.7000,
  k11: 63.3000,
  k12: 97.9000,
  k13: 32.8000,
  k14: 67.4000,
  k15: 2.3000,
  k16: 36.9000,
  k17: 71.5000,
  k18: 6.4000,
  k19: 41.0000,
  k20: 75.6000,
  k21: 10.5000,
  k22: 45.1000,
  k23: 79.7000,
  k24: 14.6000,
  k25: 49.2000,
  k26: 83.8000,
  k27: 18.7000,
  k28: 53.3000,
  k29: 87.9000,
  k30: 22.8000,
  k31: 57.4000,
  k32: 92.0000,
  k33: 26.9000,
  k34: 61.5000,
  k35: 96.1000,
  k36: 31.0000,
  k37: 65.6000,
  k38: 0.5000,
  k39: 35.1000,
  k40: 69.7000,
  k41: 4.6000,
  k42: 39.2000,
  k43: 73.8000,
  k44: 8.7000,
  k45: 43.3000,
  k46: 77.9000,
  k47: 12.8000,
  k48: 47.4000,
  k49: 82.0000,
  k50: 16.9000,
  k51: 51.5000,
  k52: 86.1000,
  k53: 21.0000,
  k54: 55.6000,
  k55: 90.2000,
  k56: 25.1000,
  k57: 59.7000,
  k58: 94.3000,
  k59: 29.2000,
  k60: 63.8000,
  k61: 98.4000,
  k62: 33.3000,
  k63: 67.9000,
  k64: 2.8000,
  k65: 37.4000,
  k66: 72.0000,
  k67: 6.9000,
  k68: 41.5000,
  k69: 76.1000,
  k70: 11.0000,
  k71: 45.6000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_060_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_060_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_060_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_060_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_060_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_060_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_060_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_060_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_060_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_060_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_060_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_060_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
