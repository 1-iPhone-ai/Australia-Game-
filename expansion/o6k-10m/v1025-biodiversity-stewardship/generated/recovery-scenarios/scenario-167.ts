import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 167 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_167_META = {
  id: 'stress_167',
  regionId: 'ACT' as V1025BioRegionId,
  primaryChannel: 'indigenous_care' as V1025BioStewardshipChannel,
  stewardshipBand: 'elevated' as V1025BioStewardshipBand,
  seed: 152658,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_167_COEF = {
  k0: 29.0000,
  k1: 40.7000,
  k2: 52.4000,
  k3: 64.1000,
  k4: 75.8000,
  k5: 87.5000,
  k6: 99.2000,
  k7: 11.2000,
  k8: 22.9000,
  k9: 34.6000,
  k10: 46.3000,
  k11: 58.0000,
  k12: 69.7000,
  k13: 81.4000,
  k14: 93.1000,
  k15: 5.1000,
  k16: 16.8000,
  k17: 28.5000,
  k18: 40.2000,
  k19: 51.9000,
  k20: 63.6000,
  k21: 75.3000,
  k22: 87.0000,
  k23: 98.7000,
  k24: 10.7000,
  k25: 22.4000,
  k26: 34.1000,
  k27: 45.8000,
  k28: 57.5000,
  k29: 69.2000,
  k30: 80.9000,
  k31: 92.6000,
  k32: 4.6000,
  k33: 16.3000,
  k34: 28.0000,
  k35: 39.7000,
  k36: 51.4000,
  k37: 63.1000,
  k38: 74.8000,
  k39: 86.5000,
  k40: 98.2000,
  k41: 10.2000,
  k42: 21.9000,
  k43: 33.6000,
  k44: 45.3000,
  k45: 57.0000,
  k46: 68.7000,
  k47: 80.4000,
  k48: 92.1000,
  k49: 4.1000,
  k50: 15.8000,
  k51: 27.5000,
  k52: 39.2000,
  k53: 50.9000,
  k54: 62.6000,
  k55: 74.3000,
  k56: 86.0000,
  k57: 97.7000,
  k58: 9.7000,
  k59: 21.4000,
  k60: 33.1000,
  k61: 44.8000,
  k62: 56.5000,
  k63: 68.2000,
  k64: 79.9000,
  k65: 91.6000,
  k66: 3.6000,
  k67: 15.3000,
  k68: 27.0000,
  k69: 38.7000,
  k70: 50.4000,
  k71: 62.1000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_167_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_167_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_167_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_167_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_167_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_167_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_167_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_167_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_167_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_167_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_167_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_167_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
