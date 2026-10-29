import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 110 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_110_META = {
  id: 'stress_110',
  regionId: 'NT' as V1025BioRegionId,
  primaryChannel: 'species_recovery' as V1025BioStewardshipChannel,
  stewardshipBand: 'minimal' as V1025BioStewardshipBand,
  seed: 100731,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_110_COEF = {
  k0: 37.4000,
  k1: 40.8000,
  k2: 44.2000,
  k3: 47.6000,
  k4: 51.0000,
  k5: 54.4000,
  k6: 57.8000,
  k7: 61.2000,
  k8: 64.6000,
  k9: 68.0000,
  k10: 71.4000,
  k11: 74.8000,
  k12: 78.2000,
  k13: 81.6000,
  k14: 85.0000,
  k15: 88.4000,
  k16: 91.8000,
  k17: 95.2000,
  k18: 98.6000,
  k19: 2.3000,
  k20: 5.7000,
  k21: 9.1000,
  k22: 12.5000,
  k23: 15.9000,
  k24: 19.3000,
  k25: 22.7000,
  k26: 26.1000,
  k27: 29.5000,
  k28: 32.9000,
  k29: 36.3000,
  k30: 39.7000,
  k31: 43.1000,
  k32: 46.5000,
  k33: 49.9000,
  k34: 53.3000,
  k35: 56.7000,
  k36: 60.1000,
  k37: 63.5000,
  k38: 66.9000,
  k39: 70.3000,
  k40: 73.7000,
  k41: 77.1000,
  k42: 80.5000,
  k43: 83.9000,
  k44: 87.3000,
  k45: 90.7000,
  k46: 94.1000,
  k47: 97.5000,
  k48: 1.2000,
  k49: 4.6000,
  k50: 8.0000,
  k51: 11.4000,
  k52: 14.8000,
  k53: 18.2000,
  k54: 21.6000,
  k55: 25.0000,
  k56: 28.4000,
  k57: 31.8000,
  k58: 35.2000,
  k59: 38.6000,
  k60: 42.0000,
  k61: 45.4000,
  k62: 48.8000,
  k63: 52.2000,
  k64: 55.6000,
  k65: 59.0000,
  k66: 62.4000,
  k67: 65.8000,
  k68: 69.2000,
  k69: 72.6000,
  k70: 76.0000,
  k71: 79.4000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_110_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_110_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_110_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_110_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_110_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_110_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_110_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_110_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_110_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_110_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_110_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_110_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
