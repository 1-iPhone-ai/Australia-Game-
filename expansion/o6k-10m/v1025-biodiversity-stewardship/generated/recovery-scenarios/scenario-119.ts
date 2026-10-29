import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 119 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_119_META = {
  id: 'stress_119',
  regionId: 'ACT' as V1025BioRegionId,
  primaryChannel: 'remote' as V1025BioStewardshipChannel,
  stewardshipBand: 'recovering' as V1025BioStewardshipBand,
  seed: 108930,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_119_COEF = {
  k0: 83.3000,
  k1: 9.3000,
  k2: 35.0000,
  k3: 60.7000,
  k4: 86.4000,
  k5: 12.4000,
  k6: 38.1000,
  k7: 63.8000,
  k8: 89.5000,
  k9: 15.5000,
  k10: 41.2000,
  k11: 66.9000,
  k12: 92.6000,
  k13: 18.6000,
  k14: 44.3000,
  k15: 70.0000,
  k16: 95.7000,
  k17: 21.7000,
  k18: 47.4000,
  k19: 73.1000,
  k20: 98.8000,
  k21: 24.8000,
  k22: 50.5000,
  k23: 76.2000,
  k24: 2.2000,
  k25: 27.9000,
  k26: 53.6000,
  k27: 79.3000,
  k28: 5.3000,
  k29: 31.0000,
  k30: 56.7000,
  k31: 82.4000,
  k32: 8.4000,
  k33: 34.1000,
  k34: 59.8000,
  k35: 85.5000,
  k36: 11.5000,
  k37: 37.2000,
  k38: 62.9000,
  k39: 88.6000,
  k40: 14.6000,
  k41: 40.3000,
  k42: 66.0000,
  k43: 91.7000,
  k44: 17.7000,
  k45: 43.4000,
  k46: 69.1000,
  k47: 94.8000,
  k48: 20.8000,
  k49: 46.5000,
  k50: 72.2000,
  k51: 97.9000,
  k52: 23.9000,
  k53: 49.6000,
  k54: 75.3000,
  k55: 1.3000,
  k56: 27.0000,
  k57: 52.7000,
  k58: 78.4000,
  k59: 4.4000,
  k60: 30.1000,
  k61: 55.8000,
  k62: 81.5000,
  k63: 7.5000,
  k64: 33.2000,
  k65: 58.9000,
  k66: 84.6000,
  k67: 10.6000,
  k68: 36.3000,
  k69: 62.0000,
  k70: 87.7000,
  k71: 13.7000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_119_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_119_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_119_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_119_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_119_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_119_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_119_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_119_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_119_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_119_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_119_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_119_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
