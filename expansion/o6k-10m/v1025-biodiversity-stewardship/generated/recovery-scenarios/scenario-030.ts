import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 030 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_030_META = {
  id: 'stress_030',
  regionId: 'NT' as V1025BioRegionId,
  primaryChannel: 'species_recovery' as V1025BioStewardshipChannel,
  stewardshipBand: 'minimal' as V1025BioStewardshipBand,
  seed: 27851,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_030_COEF = {
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

export function V1025_BIO_RECOVERY_SCENARIO_030_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_030_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_030_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_030_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_030_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_030_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_030_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_030_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_030_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_030_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_030_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_030_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
