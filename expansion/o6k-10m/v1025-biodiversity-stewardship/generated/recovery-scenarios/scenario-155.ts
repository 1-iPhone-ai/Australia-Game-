import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 155 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_155_META = {
  id: 'stress_155',
  regionId: 'WA' as V1025BioRegionId,
  primaryChannel: 'marine_protected' as V1025BioStewardshipChannel,
  stewardshipBand: 'minimal' as V1025BioStewardshipBand,
  seed: 141726,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_155_COEF = {
  k0: 67.5000,
  k1: 82.7000,
  k2: 97.9000,
  k3: 13.4000,
  k4: 28.6000,
  k5: 43.8000,
  k6: 59.0000,
  k7: 74.2000,
  k8: 89.4000,
  k9: 4.9000,
  k10: 20.1000,
  k11: 35.3000,
  k12: 50.5000,
  k13: 65.7000,
  k14: 80.9000,
  k15: 96.1000,
  k16: 11.6000,
  k17: 26.8000,
  k18: 42.0000,
  k19: 57.2000,
  k20: 72.4000,
  k21: 87.6000,
  k22: 3.1000,
  k23: 18.3000,
  k24: 33.5000,
  k25: 48.7000,
  k26: 63.9000,
  k27: 79.1000,
  k28: 94.3000,
  k29: 9.8000,
  k30: 25.0000,
  k31: 40.2000,
  k32: 55.4000,
  k33: 70.6000,
  k34: 85.8000,
  k35: 1.3000,
  k36: 16.5000,
  k37: 31.7000,
  k38: 46.9000,
  k39: 62.1000,
  k40: 77.3000,
  k41: 92.5000,
  k42: 8.0000,
  k43: 23.2000,
  k44: 38.4000,
  k45: 53.6000,
  k46: 68.8000,
  k47: 84.0000,
  k48: 99.2000,
  k49: 14.7000,
  k50: 29.9000,
  k51: 45.1000,
  k52: 60.3000,
  k53: 75.5000,
  k54: 90.7000,
  k55: 6.2000,
  k56: 21.4000,
  k57: 36.6000,
  k58: 51.8000,
  k59: 67.0000,
  k60: 82.2000,
  k61: 97.4000,
  k62: 12.9000,
  k63: 28.1000,
  k64: 43.3000,
  k65: 58.5000,
  k66: 73.7000,
  k67: 88.9000,
  k68: 4.4000,
  k69: 19.6000,
  k70: 34.8000,
  k71: 50.0000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_155_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_155_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_155_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_155_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_155_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_155_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_155_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_155_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_155_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_155_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_155_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_155_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
