import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 136 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_136_META = {
  id: 'stress_136',
  regionId: 'NSW' as V1025BioRegionId,
  primaryChannel: 'urban_green' as V1025BioStewardshipChannel,
  stewardshipBand: 'moderate' as V1025BioStewardshipBand,
  seed: 124417,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_136_COEF = {
  k0: 70.3000,
  k1: 49.5000,
  k2: 28.7000,
  k3: 7.9000,
  k4: 86.8000,
  k5: 66.0000,
  k6: 45.2000,
  k7: 24.4000,
  k8: 3.6000,
  k9: 82.5000,
  k10: 61.7000,
  k11: 40.9000,
  k12: 20.1000,
  k13: 99.0000,
  k14: 78.2000,
  k15: 57.4000,
  k16: 36.6000,
  k17: 15.8000,
  k18: 94.7000,
  k19: 73.9000,
  k20: 53.1000,
  k21: 32.3000,
  k22: 11.5000,
  k23: 90.4000,
  k24: 69.6000,
  k25: 48.8000,
  k26: 28.0000,
  k27: 7.2000,
  k28: 86.1000,
  k29: 65.3000,
  k30: 44.5000,
  k31: 23.7000,
  k32: 2.9000,
  k33: 81.8000,
  k34: 61.0000,
  k35: 40.2000,
  k36: 19.4000,
  k37: 98.3000,
  k38: 77.5000,
  k39: 56.7000,
  k40: 35.9000,
  k41: 15.1000,
  k42: 94.0000,
  k43: 73.2000,
  k44: 52.4000,
  k45: 31.6000,
  k46: 10.8000,
  k47: 89.7000,
  k48: 68.9000,
  k49: 48.1000,
  k50: 27.3000,
  k51: 6.5000,
  k52: 85.4000,
  k53: 64.6000,
  k54: 43.8000,
  k55: 23.0000,
  k56: 2.2000,
  k57: 81.1000,
  k58: 60.3000,
  k59: 39.5000,
  k60: 18.7000,
  k61: 97.6000,
  k62: 76.8000,
  k63: 56.0000,
  k64: 35.2000,
  k65: 14.4000,
  k66: 93.3000,
  k67: 72.5000,
  k68: 51.7000,
  k69: 30.9000,
  k70: 10.1000,
  k71: 89.0000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_136_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_136_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_136_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_136_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_136_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_136_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_136_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_136_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_136_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_136_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_136_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_136_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
