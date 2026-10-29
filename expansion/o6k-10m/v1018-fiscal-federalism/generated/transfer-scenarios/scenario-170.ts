import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 170 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_170_META = {
  id: 'transfer_170',
  regionId: 'QLD' as V1018FfedRegionId,
  primarySystem: 'freight' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 149131,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_170_COEF = {
  k0: 39.4000,
  k1: 87.5000,
  k2: 36.5000,
  k3: 84.6000,
  k4: 33.6000,
  k5: 81.7000,
  k6: 30.7000,
  k7: 78.8000,
  k8: 27.8000,
  k9: 75.9000,
  k10: 24.9000,
  k11: 73.0000,
  k12: 22.0000,
  k13: 70.1000,
  k14: 19.1000,
  k15: 67.2000,
  k16: 16.2000,
  k17: 64.3000,
  k18: 13.3000,
  k19: 61.4000,
  k20: 10.4000,
  k21: 58.5000,
  k22: 7.5000,
  k23: 55.6000,
  k24: 4.6000,
  k25: 52.7000,
  k26: 1.7000,
  k27: 49.8000,
  k28: 97.9000,
  k29: 46.9000,
  k30: 95.0000,
  k31: 44.0000,
  k32: 92.1000,
  k33: 41.1000,
  k34: 89.2000,
  k35: 38.2000,
  k36: 86.3000,
  k37: 35.3000,
  k38: 83.4000,
  k39: 32.4000,
  k40: 80.5000,
  k41: 29.5000,
  k42: 77.6000,
  k43: 26.6000,
  k44: 74.7000,
  k45: 23.7000,
  k46: 71.8000,
  k47: 20.8000,
  k48: 68.9000,
  k49: 17.9000,
  k50: 66.0000,
  k51: 15.0000,
  k52: 63.1000,
  k53: 12.1000,
  k54: 60.2000,
  k55: 9.2000,
  k56: 57.3000,
  k57: 6.3000,
  k58: 54.4000,
  k59: 3.4000,
  k60: 51.5000,
  k61: 0.5000,
  k62: 48.6000,
  k63: 96.7000,
  k64: 45.7000,
  k65: 93.8000,
  k66: 42.8000,
  k67: 90.9000,
  k68: 39.9000,
  k69: 88.0000,
  k70: 37.0000,
  k71: 85.1000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_170_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_170_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_170_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_170_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_170_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_170_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_170_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_170_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_170_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_170_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_170_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_170_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
