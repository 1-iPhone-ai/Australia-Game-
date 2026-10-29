import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 032 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_032_META = {
  id: 'stress_032',
  regionId: 'NSW' as V1025BioRegionId,
  primaryChannel: 'offset_integrity' as V1025BioStewardshipChannel,
  stewardshipBand: 'elevated' as V1025BioStewardshipBand,
  seed: 29673,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_032_COEF = {
  k0: 38.4000,
  k1: 14.7000,
  k2: 90.7000,
  k3: 67.0000,
  k4: 43.3000,
  k5: 19.6000,
  k6: 95.6000,
  k7: 71.9000,
  k8: 48.2000,
  k9: 24.5000,
  k10: 0.8000,
  k11: 76.8000,
  k12: 53.1000,
  k13: 29.4000,
  k14: 5.7000,
  k15: 81.7000,
  k16: 58.0000,
  k17: 34.3000,
  k18: 10.6000,
  k19: 86.6000,
  k20: 62.9000,
  k21: 39.2000,
  k22: 15.5000,
  k23: 91.5000,
  k24: 67.8000,
  k25: 44.1000,
  k26: 20.4000,
  k27: 96.4000,
  k28: 72.7000,
  k29: 49.0000,
  k30: 25.3000,
  k31: 1.6000,
  k32: 77.6000,
  k33: 53.9000,
  k34: 30.2000,
  k35: 6.5000,
  k36: 82.5000,
  k37: 58.8000,
  k38: 35.1000,
  k39: 11.4000,
  k40: 87.4000,
  k41: 63.7000,
  k42: 40.0000,
  k43: 16.3000,
  k44: 92.3000,
  k45: 68.6000,
  k46: 44.9000,
  k47: 21.2000,
  k48: 97.2000,
  k49: 73.5000,
  k50: 49.8000,
  k51: 26.1000,
  k52: 2.4000,
  k53: 78.4000,
  k54: 54.7000,
  k55: 31.0000,
  k56: 7.3000,
  k57: 83.3000,
  k58: 59.6000,
  k59: 35.9000,
  k60: 12.2000,
  k61: 88.2000,
  k62: 64.5000,
  k63: 40.8000,
  k64: 17.1000,
  k65: 93.1000,
  k66: 69.4000,
  k67: 45.7000,
  k68: 22.0000,
  k69: 98.0000,
  k70: 74.3000,
  k71: 50.6000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_032_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_032_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_032_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_032_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_032_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_032_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_032_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_032_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_032_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_032_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_032_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_032_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
