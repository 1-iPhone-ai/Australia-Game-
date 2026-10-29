import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 120 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_120_META = {
  id: 'transfer_120',
  regionId: 'NSW' as V1018FfedRegionId,
  primarySystem: 'freight' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 105281,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_120_COEF = {
  k0: 65.4000,
  k1: 88.9000,
  k2: 13.3000,
  k3: 36.8000,
  k4: 60.3000,
  k5: 83.8000,
  k6: 8.2000,
  k7: 31.7000,
  k8: 55.2000,
  k9: 78.7000,
  k10: 3.1000,
  k11: 26.6000,
  k12: 50.1000,
  k13: 73.6000,
  k14: 97.1000,
  k15: 21.5000,
  k16: 45.0000,
  k17: 68.5000,
  k18: 92.0000,
  k19: 16.4000,
  k20: 39.9000,
  k21: 63.4000,
  k22: 86.9000,
  k23: 11.3000,
  k24: 34.8000,
  k25: 58.3000,
  k26: 81.8000,
  k27: 6.2000,
  k28: 29.7000,
  k29: 53.2000,
  k30: 76.7000,
  k31: 1.1000,
  k32: 24.6000,
  k33: 48.1000,
  k34: 71.6000,
  k35: 95.1000,
  k36: 19.5000,
  k37: 43.0000,
  k38: 66.5000,
  k39: 90.0000,
  k40: 14.4000,
  k41: 37.9000,
  k42: 61.4000,
  k43: 84.9000,
  k44: 9.3000,
  k45: 32.8000,
  k46: 56.3000,
  k47: 79.8000,
  k48: 4.2000,
  k49: 27.7000,
  k50: 51.2000,
  k51: 74.7000,
  k52: 98.2000,
  k53: 22.6000,
  k54: 46.1000,
  k55: 69.6000,
  k56: 93.1000,
  k57: 17.5000,
  k58: 41.0000,
  k59: 64.5000,
  k60: 88.0000,
  k61: 12.4000,
  k62: 35.9000,
  k63: 59.4000,
  k64: 82.9000,
  k65: 7.3000,
  k66: 30.8000,
  k67: 54.3000,
  k68: 77.8000,
  k69: 2.2000,
  k70: 25.7000,
  k71: 49.2000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_120_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_120_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_120_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_120_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_120_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_120_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_120_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_120_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_120_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_120_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_120_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_120_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
