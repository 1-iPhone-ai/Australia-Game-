import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 015 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_015_META = {
  id: 'transfer_015',
  regionId: 'ACT' as V1018FfedRegionId,
  primarySystem: 'pharma' as V1018FfedSystemDomain,
  transferBand: 'latent' as V1018FfedTransferBand,
  seed: 13196,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_015_COEF = {
  k0: 20.9000,
  k1: 52.2000,
  k2: 83.5000,
  k3: 15.7000,
  k4: 47.0000,
  k5: 78.3000,
  k6: 10.5000,
  k7: 41.8000,
  k8: 73.1000,
  k9: 5.3000,
  k10: 36.6000,
  k11: 67.9000,
  k12: 0.1000,
  k13: 31.4000,
  k14: 62.7000,
  k15: 94.0000,
  k16: 26.2000,
  k17: 57.5000,
  k18: 88.8000,
  k19: 21.0000,
  k20: 52.3000,
  k21: 83.6000,
  k22: 15.8000,
  k23: 47.1000,
  k24: 78.4000,
  k25: 10.6000,
  k26: 41.9000,
  k27: 73.2000,
  k28: 5.4000,
  k29: 36.7000,
  k30: 68.0000,
  k31: 0.2000,
  k32: 31.5000,
  k33: 62.8000,
  k34: 94.1000,
  k35: 26.3000,
  k36: 57.6000,
  k37: 88.9000,
  k38: 21.1000,
  k39: 52.4000,
  k40: 83.7000,
  k41: 15.9000,
  k42: 47.2000,
  k43: 78.5000,
  k44: 10.7000,
  k45: 42.0000,
  k46: 73.3000,
  k47: 5.5000,
  k48: 36.8000,
  k49: 68.1000,
  k50: 0.3000,
  k51: 31.6000,
  k52: 62.9000,
  k53: 94.2000,
  k54: 26.4000,
  k55: 57.7000,
  k56: 89.0000,
  k57: 21.2000,
  k58: 52.5000,
  k59: 83.8000,
  k60: 16.0000,
  k61: 47.3000,
  k62: 78.6000,
  k63: 10.8000,
  k64: 42.1000,
  k65: 73.4000,
  k66: 5.6000,
  k67: 36.9000,
  k68: 68.2000,
  k69: 0.4000,
  k70: 31.7000,
  k71: 63.0000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_015_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_015_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_015_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_015_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_015_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_015_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_015_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_015_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_015_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_015_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_015_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_015_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
