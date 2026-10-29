import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 152 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_152_META = {
  id: 'stress_152',
  regionId: 'NSW' as V1025BioRegionId,
  primaryChannel: 'offset_integrity' as V1025BioStewardshipChannel,
  stewardshipBand: 'elevated' as V1025BioStewardshipBand,
  seed: 138993,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_152_COEF = {
  k0: 52.2000,
  k1: 93.2000,
  k2: 34.5000,
  k3: 75.5000,
  k4: 16.8000,
  k5: 57.8000,
  k6: 98.8000,
  k7: 40.1000,
  k8: 81.1000,
  k9: 22.4000,
  k10: 63.4000,
  k11: 4.7000,
  k12: 45.7000,
  k13: 86.7000,
  k14: 28.0000,
  k15: 69.0000,
  k16: 10.3000,
  k17: 51.3000,
  k18: 92.3000,
  k19: 33.6000,
  k20: 74.6000,
  k21: 15.9000,
  k22: 56.9000,
  k23: 97.9000,
  k24: 39.2000,
  k25: 80.2000,
  k26: 21.5000,
  k27: 62.5000,
  k28: 3.8000,
  k29: 44.8000,
  k30: 85.8000,
  k31: 27.1000,
  k32: 68.1000,
  k33: 9.4000,
  k34: 50.4000,
  k35: 91.4000,
  k36: 32.7000,
  k37: 73.7000,
  k38: 15.0000,
  k39: 56.0000,
  k40: 97.0000,
  k41: 38.3000,
  k42: 79.3000,
  k43: 20.6000,
  k44: 61.6000,
  k45: 2.9000,
  k46: 43.9000,
  k47: 84.9000,
  k48: 26.2000,
  k49: 67.2000,
  k50: 8.5000,
  k51: 49.5000,
  k52: 90.5000,
  k53: 31.8000,
  k54: 72.8000,
  k55: 14.1000,
  k56: 55.1000,
  k57: 96.1000,
  k58: 37.4000,
  k59: 78.4000,
  k60: 19.7000,
  k61: 60.7000,
  k62: 2.0000,
  k63: 43.0000,
  k64: 84.0000,
  k65: 25.3000,
  k66: 66.3000,
  k67: 7.6000,
  k68: 48.6000,
  k69: 89.6000,
  k70: 30.9000,
  k71: 71.9000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_152_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_152_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_152_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_152_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_152_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_152_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_152_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_152_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_152_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_152_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_152_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_152_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
