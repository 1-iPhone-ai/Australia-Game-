import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 169 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_169_META = {
  id: 'stress_169',
  regionId: 'VIC' as V1025BioRegionId,
  primaryChannel: 'remote' as V1025BioStewardshipChannel,
  stewardshipBand: 'recovering' as V1025BioStewardshipBand,
  seed: 154480,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_169_COEF = {
  k0: 39.2000,
  k1: 33.7000,
  k2: 28.2000,
  k3: 22.7000,
  k4: 17.2000,
  k5: 11.7000,
  k6: 6.2000,
  k7: 0.7000,
  k8: 94.9000,
  k9: 89.4000,
  k10: 83.9000,
  k11: 78.4000,
  k12: 72.9000,
  k13: 67.4000,
  k14: 61.9000,
  k15: 56.4000,
  k16: 50.9000,
  k17: 45.4000,
  k18: 39.9000,
  k19: 34.4000,
  k20: 28.9000,
  k21: 23.4000,
  k22: 17.9000,
  k23: 12.4000,
  k24: 6.9000,
  k25: 1.4000,
  k26: 95.6000,
  k27: 90.1000,
  k28: 84.6000,
  k29: 79.1000,
  k30: 73.6000,
  k31: 68.1000,
  k32: 62.6000,
  k33: 57.1000,
  k34: 51.6000,
  k35: 46.1000,
  k36: 40.6000,
  k37: 35.1000,
  k38: 29.6000,
  k39: 24.1000,
  k40: 18.6000,
  k41: 13.1000,
  k42: 7.6000,
  k43: 2.1000,
  k44: 96.3000,
  k45: 90.8000,
  k46: 85.3000,
  k47: 79.8000,
  k48: 74.3000,
  k49: 68.8000,
  k50: 63.3000,
  k51: 57.8000,
  k52: 52.3000,
  k53: 46.8000,
  k54: 41.3000,
  k55: 35.8000,
  k56: 30.3000,
  k57: 24.8000,
  k58: 19.3000,
  k59: 13.8000,
  k60: 8.3000,
  k61: 2.8000,
  k62: 97.0000,
  k63: 91.5000,
  k64: 86.0000,
  k65: 80.5000,
  k66: 75.0000,
  k67: 69.5000,
  k68: 64.0000,
  k69: 58.5000,
  k70: 53.0000,
  k71: 47.5000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_169_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_169_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_169_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_169_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_169_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_169_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_169_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_169_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_169_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_169_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_169_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_169_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
