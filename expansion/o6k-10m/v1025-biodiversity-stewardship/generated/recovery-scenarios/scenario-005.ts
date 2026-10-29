import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 005 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_005_META = {
  id: 'stress_005',
  regionId: 'TAS' as V1025BioRegionId,
  primaryChannel: 'marine_protected' as V1025BioStewardshipChannel,
  stewardshipBand: 'minimal' as V1025BioStewardshipBand,
  seed: 5076,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_005_COEF = {
  k0: 0.4000,
  k1: 9.5000,
  k2: 18.6000,
  k3: 27.7000,
  k4: 36.8000,
  k5: 45.9000,
  k6: 55.0000,
  k7: 64.1000,
  k8: 73.2000,
  k9: 82.3000,
  k10: 91.4000,
  k11: 0.8000,
  k12: 9.9000,
  k13: 19.0000,
  k14: 28.1000,
  k15: 37.2000,
  k16: 46.3000,
  k17: 55.4000,
  k18: 64.5000,
  k19: 73.6000,
  k20: 82.7000,
  k21: 91.8000,
  k22: 1.2000,
  k23: 10.3000,
  k24: 19.4000,
  k25: 28.5000,
  k26: 37.6000,
  k27: 46.7000,
  k28: 55.8000,
  k29: 64.9000,
  k30: 74.0000,
  k31: 83.1000,
  k32: 92.2000,
  k33: 1.6000,
  k34: 10.7000,
  k35: 19.8000,
  k36: 28.9000,
  k37: 38.0000,
  k38: 47.1000,
  k39: 56.2000,
  k40: 65.3000,
  k41: 74.4000,
  k42: 83.5000,
  k43: 92.6000,
  k44: 2.0000,
  k45: 11.1000,
  k46: 20.2000,
  k47: 29.3000,
  k48: 38.4000,
  k49: 47.5000,
  k50: 56.6000,
  k51: 65.7000,
  k52: 74.8000,
  k53: 83.9000,
  k54: 93.0000,
  k55: 2.4000,
  k56: 11.5000,
  k57: 20.6000,
  k58: 29.7000,
  k59: 38.8000,
  k60: 47.9000,
  k61: 57.0000,
  k62: 66.1000,
  k63: 75.2000,
  k64: 84.3000,
  k65: 93.4000,
  k66: 2.8000,
  k67: 11.9000,
  k68: 21.0000,
  k69: 30.1000,
  k70: 39.2000,
  k71: 48.3000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_005_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_005_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_005_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_005_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_005_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_005_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_005_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_005_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_005_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_005_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_005_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_005_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
