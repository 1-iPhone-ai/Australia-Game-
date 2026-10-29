import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 145 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_145_META = {
  id: 'stress_145',
  regionId: 'VIC' as V1025BioRegionId,
  primaryChannel: 'marine_protected' as V1025BioStewardshipChannel,
  stewardshipBand: 'minimal' as V1025BioStewardshipBand,
  seed: 132616,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_145_COEF = {
  k0: 16.5000,
  k1: 18.0000,
  k2: 19.5000,
  k3: 21.0000,
  k4: 22.5000,
  k5: 24.0000,
  k6: 25.5000,
  k7: 27.0000,
  k8: 28.5000,
  k9: 30.0000,
  k10: 31.5000,
  k11: 33.0000,
  k12: 34.5000,
  k13: 36.0000,
  k14: 37.5000,
  k15: 39.0000,
  k16: 40.5000,
  k17: 42.0000,
  k18: 43.5000,
  k19: 45.0000,
  k20: 46.5000,
  k21: 48.0000,
  k22: 49.5000,
  k23: 51.0000,
  k24: 52.5000,
  k25: 54.0000,
  k26: 55.5000,
  k27: 57.0000,
  k28: 58.5000,
  k29: 60.0000,
  k30: 61.5000,
  k31: 63.0000,
  k32: 64.5000,
  k33: 66.0000,
  k34: 67.5000,
  k35: 69.0000,
  k36: 70.5000,
  k37: 72.0000,
  k38: 73.5000,
  k39: 75.0000,
  k40: 76.5000,
  k41: 78.0000,
  k42: 79.5000,
  k43: 81.0000,
  k44: 82.5000,
  k45: 84.0000,
  k46: 85.5000,
  k47: 87.0000,
  k48: 88.5000,
  k49: 90.0000,
  k50: 91.5000,
  k51: 93.0000,
  k52: 94.5000,
  k53: 96.0000,
  k54: 97.5000,
  k55: 99.0000,
  k56: 0.8000,
  k57: 2.3000,
  k58: 3.8000,
  k59: 5.3000,
  k60: 6.8000,
  k61: 8.3000,
  k62: 9.8000,
  k63: 11.3000,
  k64: 12.8000,
  k65: 14.3000,
  k66: 15.8000,
  k67: 17.3000,
  k68: 18.8000,
  k69: 20.3000,
  k70: 21.8000,
  k71: 23.3000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_145_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_145_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_145_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_145_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_145_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_145_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_145_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_145_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_145_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_145_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_145_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_145_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
