import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 132 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_132_META = {
  id: 'transfer_132',
  regionId: 'SA' as V1018FfedRegionId,
  primarySystem: 'water' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 115805,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_132_COEF = {
  k0: 98.8000,
  k1: 84.6000,
  k2: 70.4000,
  k3: 56.2000,
  k4: 42.0000,
  k5: 27.8000,
  k6: 13.6000,
  k7: 98.5000,
  k8: 84.3000,
  k9: 70.1000,
  k10: 55.9000,
  k11: 41.7000,
  k12: 27.5000,
  k13: 13.3000,
  k14: 98.2000,
  k15: 84.0000,
  k16: 69.8000,
  k17: 55.6000,
  k18: 41.4000,
  k19: 27.2000,
  k20: 13.0000,
  k21: 97.9000,
  k22: 83.7000,
  k23: 69.5000,
  k24: 55.3000,
  k25: 41.1000,
  k26: 26.9000,
  k27: 12.7000,
  k28: 97.6000,
  k29: 83.4000,
  k30: 69.2000,
  k31: 55.0000,
  k32: 40.8000,
  k33: 26.6000,
  k34: 12.4000,
  k35: 97.3000,
  k36: 83.1000,
  k37: 68.9000,
  k38: 54.7000,
  k39: 40.5000,
  k40: 26.3000,
  k41: 12.1000,
  k42: 97.0000,
  k43: 82.8000,
  k44: 68.6000,
  k45: 54.4000,
  k46: 40.2000,
  k47: 26.0000,
  k48: 11.8000,
  k49: 96.7000,
  k50: 82.5000,
  k51: 68.3000,
  k52: 54.1000,
  k53: 39.9000,
  k54: 25.7000,
  k55: 11.5000,
  k56: 96.4000,
  k57: 82.2000,
  k58: 68.0000,
  k59: 53.8000,
  k60: 39.6000,
  k61: 25.4000,
  k62: 11.2000,
  k63: 96.1000,
  k64: 81.9000,
  k65: 67.7000,
  k66: 53.5000,
  k67: 39.3000,
  k68: 25.1000,
  k69: 10.9000,
  k70: 95.8000,
  k71: 81.6000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_132_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_132_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_132_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_132_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_132_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_132_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_132_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_132_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_132_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_132_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_132_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_132_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
