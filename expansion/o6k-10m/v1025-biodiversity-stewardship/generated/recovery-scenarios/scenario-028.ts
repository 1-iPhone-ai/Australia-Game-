import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 028 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_028_META = {
  id: 'stress_028',
  regionId: 'SA' as V1025BioRegionId,
  primaryChannel: 'regional' as V1025BioStewardshipChannel,
  stewardshipBand: 'critical' as V1025BioStewardshipBand,
  seed: 26029,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_028_COEF = {
  k0: 18.0000,
  k1: 28.7000,
  k2: 39.4000,
  k3: 50.1000,
  k4: 60.8000,
  k5: 71.5000,
  k6: 82.2000,
  k7: 92.9000,
  k8: 3.9000,
  k9: 14.6000,
  k10: 25.3000,
  k11: 36.0000,
  k12: 46.7000,
  k13: 57.4000,
  k14: 68.1000,
  k15: 78.8000,
  k16: 89.5000,
  k17: 0.5000,
  k18: 11.2000,
  k19: 21.9000,
  k20: 32.6000,
  k21: 43.3000,
  k22: 54.0000,
  k23: 64.7000,
  k24: 75.4000,
  k25: 86.1000,
  k26: 96.8000,
  k27: 7.8000,
  k28: 18.5000,
  k29: 29.2000,
  k30: 39.9000,
  k31: 50.6000,
  k32: 61.3000,
  k33: 72.0000,
  k34: 82.7000,
  k35: 93.4000,
  k36: 4.4000,
  k37: 15.1000,
  k38: 25.8000,
  k39: 36.5000,
  k40: 47.2000,
  k41: 57.9000,
  k42: 68.6000,
  k43: 79.3000,
  k44: 90.0000,
  k45: 1.0000,
  k46: 11.7000,
  k47: 22.4000,
  k48: 33.1000,
  k49: 43.8000,
  k50: 54.5000,
  k51: 65.2000,
  k52: 75.9000,
  k53: 86.6000,
  k54: 97.3000,
  k55: 8.3000,
  k56: 19.0000,
  k57: 29.7000,
  k58: 40.4000,
  k59: 51.1000,
  k60: 61.8000,
  k61: 72.5000,
  k62: 83.2000,
  k63: 93.9000,
  k64: 4.9000,
  k65: 15.6000,
  k66: 26.3000,
  k67: 37.0000,
  k68: 47.7000,
  k69: 58.4000,
  k70: 69.1000,
  k71: 79.8000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_028_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_028_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_028_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_028_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_028_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_028_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_028_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_028_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_028_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_028_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_028_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_028_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
