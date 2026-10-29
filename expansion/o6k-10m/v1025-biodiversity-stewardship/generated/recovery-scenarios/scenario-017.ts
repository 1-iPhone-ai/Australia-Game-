import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 017 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_017_META = {
  id: 'stress_017',
  regionId: 'VIC' as V1025BioRegionId,
  primaryChannel: 'indigenous_care' as V1025BioStewardshipChannel,
  stewardshipBand: 'elevated' as V1025BioStewardshipBand,
  seed: 16008,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_017_COEF = {
  k0: 61.6000,
  k1: 67.2000,
  k2: 72.8000,
  k3: 78.4000,
  k4: 84.0000,
  k5: 89.6000,
  k6: 95.2000,
  k7: 1.1000,
  k8: 6.7000,
  k9: 12.3000,
  k10: 17.9000,
  k11: 23.5000,
  k12: 29.1000,
  k13: 34.7000,
  k14: 40.3000,
  k15: 45.9000,
  k16: 51.5000,
  k17: 57.1000,
  k18: 62.7000,
  k19: 68.3000,
  k20: 73.9000,
  k21: 79.5000,
  k22: 85.1000,
  k23: 90.7000,
  k24: 96.3000,
  k25: 2.2000,
  k26: 7.8000,
  k27: 13.4000,
  k28: 19.0000,
  k29: 24.6000,
  k30: 30.2000,
  k31: 35.8000,
  k32: 41.4000,
  k33: 47.0000,
  k34: 52.6000,
  k35: 58.2000,
  k36: 63.8000,
  k37: 69.4000,
  k38: 75.0000,
  k39: 80.6000,
  k40: 86.2000,
  k41: 91.8000,
  k42: 97.4000,
  k43: 3.3000,
  k44: 8.9000,
  k45: 14.5000,
  k46: 20.1000,
  k47: 25.7000,
  k48: 31.3000,
  k49: 36.9000,
  k50: 42.5000,
  k51: 48.1000,
  k52: 53.7000,
  k53: 59.3000,
  k54: 64.9000,
  k55: 70.5000,
  k56: 76.1000,
  k57: 81.7000,
  k58: 87.3000,
  k59: 92.9000,
  k60: 98.5000,
  k61: 4.4000,
  k62: 10.0000,
  k63: 15.6000,
  k64: 21.2000,
  k65: 26.8000,
  k66: 32.4000,
  k67: 38.0000,
  k68: 43.6000,
  k69: 49.2000,
  k70: 54.8000,
  k71: 60.4000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_017_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_017_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_017_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_017_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_017_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_017_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_017_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_017_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_017_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_017_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_017_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_017_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
