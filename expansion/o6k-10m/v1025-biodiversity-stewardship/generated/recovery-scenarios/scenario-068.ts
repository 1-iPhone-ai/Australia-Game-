import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 068 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_068_META = {
  id: 'stress_068',
  regionId: 'SA' as V1025BioRegionId,
  primaryChannel: 'regional' as V1025BioStewardshipChannel,
  stewardshipBand: 'critical' as V1025BioStewardshipBand,
  seed: 62469,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_068_COEF = {
  k0: 22.6000,
  k1: 88.1000,
  k2: 53.9000,
  k3: 19.7000,
  k4: 85.2000,
  k5: 51.0000,
  k6: 16.8000,
  k7: 82.3000,
  k8: 48.1000,
  k9: 13.9000,
  k10: 79.4000,
  k11: 45.2000,
  k12: 11.0000,
  k13: 76.5000,
  k14: 42.3000,
  k15: 8.1000,
  k16: 73.6000,
  k17: 39.4000,
  k18: 5.2000,
  k19: 70.7000,
  k20: 36.5000,
  k21: 2.3000,
  k22: 67.8000,
  k23: 33.6000,
  k24: 99.1000,
  k25: 64.9000,
  k26: 30.7000,
  k27: 96.2000,
  k28: 62.0000,
  k29: 27.8000,
  k30: 93.3000,
  k31: 59.1000,
  k32: 24.9000,
  k33: 90.4000,
  k34: 56.2000,
  k35: 22.0000,
  k36: 87.5000,
  k37: 53.3000,
  k38: 19.1000,
  k39: 84.6000,
  k40: 50.4000,
  k41: 16.2000,
  k42: 81.7000,
  k43: 47.5000,
  k44: 13.3000,
  k45: 78.8000,
  k46: 44.6000,
  k47: 10.4000,
  k48: 75.9000,
  k49: 41.7000,
  k50: 7.5000,
  k51: 73.0000,
  k52: 38.8000,
  k53: 4.6000,
  k54: 70.1000,
  k55: 35.9000,
  k56: 1.7000,
  k57: 67.2000,
  k58: 33.0000,
  k59: 98.5000,
  k60: 64.3000,
  k61: 30.1000,
  k62: 95.6000,
  k63: 61.4000,
  k64: 27.2000,
  k65: 92.7000,
  k66: 58.5000,
  k67: 24.3000,
  k68: 89.8000,
  k69: 55.6000,
  k70: 21.4000,
  k71: 86.9000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_068_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_068_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_068_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_068_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_068_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_068_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_068_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_068_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_068_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_068_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_068_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_068_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
