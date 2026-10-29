import { V1025_BIO_clamp, V1025_BIO_stewardshipBandFromScore } from '../../engine/biodiversity-stewardship-utils.ts';
import type {
  V1025BioStewardshipBand,
  V1025BioRegionId,
  V1025BioRecoverySnapshot,
  V1025BioStewardshipChannel,
} from '../../types/core.ts';

/** Generated recovery scenario 093 — species/habitat/offset handoff matrix. */
export const V1025_BIO_RECOVERY_SCENARIO_093_META = {
  id: 'stress_093',
  regionId: 'TAS' as V1025BioRegionId,
  primaryChannel: 'invasive_pressure' as V1025BioStewardshipChannel,
  stewardshipBand: 'critical' as V1025BioStewardshipBand,
  seed: 85244,
} as const;

const V1025_BIO_RECOVERY_SCENARIO_093_COEF = {
  k0: 50.4000,
  k1: 0.6000,
  k2: 50.5000,
  k3: 0.7000,
  k4: 50.6000,
  k5: 0.8000,
  k6: 50.7000,
  k7: 0.9000,
  k8: 50.8000,
  k9: 1.0000,
  k10: 50.9000,
  k11: 1.1000,
  k12: 51.0000,
  k13: 1.2000,
  k14: 51.1000,
  k15: 1.3000,
  k16: 51.2000,
  k17: 1.4000,
  k18: 51.3000,
  k19: 1.5000,
  k20: 51.4000,
  k21: 1.6000,
  k22: 51.5000,
  k23: 1.7000,
  k24: 51.6000,
  k25: 1.8000,
  k26: 51.7000,
  k27: 1.9000,
  k28: 51.8000,
  k29: 2.0000,
  k30: 51.9000,
  k31: 2.1000,
  k32: 52.0000,
  k33: 2.2000,
  k34: 52.1000,
  k35: 2.3000,
  k36: 52.2000,
  k37: 2.4000,
  k38: 52.3000,
  k39: 2.5000,
  k40: 52.4000,
  k41: 2.6000,
  k42: 52.5000,
  k43: 2.7000,
  k44: 52.6000,
  k45: 2.8000,
  k46: 52.7000,
  k47: 2.9000,
  k48: 52.8000,
  k49: 3.0000,
  k50: 52.9000,
  k51: 3.1000,
  k52: 53.0000,
  k53: 3.2000,
  k54: 53.1000,
  k55: 3.3000,
  k56: 53.2000,
  k57: 3.4000,
  k58: 53.3000,
  k59: 3.5000,
  k60: 53.4000,
  k61: 3.6000,
  k62: 53.5000,
  k63: 3.7000,
  k64: 53.6000,
  k65: 3.8000,
  k66: 53.7000,
  k67: 3.9000,
  k68: 53.8000,
  k69: 4.0000,
  k70: 53.9000,
  k71: 4.1000,
} as const;

export function V1025_BIO_RECOVERY_SCENARIO_093_evaluate(turn: number): {
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1025_BIO_RECOVERY_SCENARIO_093_COEF) as Array<
    keyof typeof V1025_BIO_RECOVERY_SCENARIO_093_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1025_BIO_RECOVERY_SCENARIO_093_COEF[keys[j]] * ((turn + j) % 17);
  }
  const ecosystemStressIndex = V1025_BIO_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const conservationOffsetDelayTurns = V1025_BIO_clamp(2 + (acc % 11), 1, 18);
  const stewardshipScore = V1025_BIO_clamp(90 - ecosystemStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1025_BIO_stewardshipBandFromScore(stewardshipScore) !== 'fragile';
  return { ecosystemStressIndex, conservationOffsetDelayTurns, stewardshipScore, stable };
}

export function V1025_BIO_RECOVERY_SCENARIO_093_snapshot(turn: number): V1025BioRecoverySnapshot {
  const r = V1025_BIO_RECOVERY_SCENARIO_093_evaluate(turn);
  return {
    scenarioId: V1025_BIO_RECOVERY_SCENARIO_093_META.id,
    regionId: V1025_BIO_RECOVERY_SCENARIO_093_META.regionId,
    stewardshipChannel: V1025_BIO_RECOVERY_SCENARIO_093_META.primaryChannel,
    stewardshipBand: V1025_BIO_RECOVERY_SCENARIO_093_META.stewardshipBand,
    ecosystemStressIndex: r.ecosystemStressIndex,
    conservationOffsetDelayTurns: r.conservationOffsetDelayTurns,
    stewardshipScore: r.stewardshipScore,
    stewardshipBand: V1025_BIO_stewardshipBandFromScore(r.stewardshipScore),
  };
}

export function V1025_BIO_RECOVERY_SCENARIO_093_regressionAssert(turn: number): boolean {
  const r = V1025_BIO_RECOVERY_SCENARIO_093_evaluate(turn);
  return typeof r.ecosystemStressIndex === 'number' && r.stewardshipScore <= 100;
}
