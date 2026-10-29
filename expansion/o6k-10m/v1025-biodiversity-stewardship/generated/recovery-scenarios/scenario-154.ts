import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 154 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_154_META = {
  id: 'stress_154',
  regionId: 'QLD' as V1025BioRegionId,
  primaryChannel: 'fire_regime' as V1025BioStewardshipChannel,
  stewardshipBand: 'recovering' as V1025BioStewardshipBand,
  seed: 140815,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_154_COEF = {
  k0: 62.4000,
  k1: 86.2000,
  k2: 10.3000,
  k3: 34.1000,
  k4: 57.9000,
  k5: 81.7000,
  k6: 5.8000,
  k7: 29.6000,
  k8: 53.4000,
  k9: 77.2000,
  k10: 1.3000,
  k11: 25.1000,
  k12: 48.9000,
  k13: 72.7000,
  k14: 96.5000,
  k15: 20.6000,
  k16: 44.4000,
  k17: 68.2000,
  k18: 92.0000,
  k19: 16.1000,
  k20: 39.9000,
  k21: 63.7000,
  k22: 87.5000,
  k23: 11.6000,
  k24: 35.4000,
  k25: 59.2000,
  k26: 83.0000,
  k27: 7.1000,
  k28: 30.9000,
  k29: 54.7000,
  k30: 78.5000,
  k31: 2.6000,
  k32: 26.4000,
  k33: 50.2000,
  k34: 74.0000,
  k35: 97.8000,
  k36: 21.9000,
  k37: 45.7000,
  k38: 69.5000,
  k39: 93.3000,
  k40: 17.4000,
  k41: 41.2000,
  k42: 65.0000,
  k43: 88.8000,
  k44: 12.9000,
  k45: 36.7000,
  k46: 60.5000,
  k47: 84.3000,
  k48: 8.4000,
  k49: 32.2000,
  k50: 56.0000,
  k51: 79.8000,
  k52: 3.9000,
  k53: 27.7000,
  k54: 51.5000,
  k55: 75.3000,
  k56: 99.1000,
  k57: 23.2000,
  k58: 47.0000,
  k59: 70.8000,
  k60: 94.6000,
  k61: 18.7000,
  k62: 42.5000,
  k63: 66.3000,
  k64: 90.1000,
  k65: 14.2000,
  k66: 38.0000,
  k67: 61.8000,
  k68: 85.6000,
  k69: 9.7000,
  k70: 33.5000,
  k71: 57.3000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_154_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_154_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_154_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_154_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_154_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_154_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_154_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_154_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_154_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_154_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_154_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_154_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
