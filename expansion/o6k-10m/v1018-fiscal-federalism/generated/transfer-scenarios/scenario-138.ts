import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 138 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_138_META = {
  id: 'transfer_138',
  regionId: 'QLD' as V1018FfedRegionId,
  primarySystem: 'telecom' as V1018FfedSystemDomain,
  transferBand: 'critical' as V1018FfedTransferBand,
  seed: 121067,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_138_COEF = {
  k0: 16.4000,
  k1: 32.9000,
  k2: 49.4000,
  k3: 65.9000,
  k4: 82.4000,
  k5: 98.9000,
  k6: 16.3000,
  k7: 32.8000,
  k8: 49.3000,
  k9: 65.8000,
  k10: 82.3000,
  k11: 98.8000,
  k12: 16.2000,
  k13: 32.7000,
  k14: 49.2000,
  k15: 65.7000,
  k16: 82.2000,
  k17: 98.7000,
  k18: 16.1000,
  k19: 32.6000,
  k20: 49.1000,
  k21: 65.6000,
  k22: 82.1000,
  k23: 98.6000,
  k24: 16.0000,
  k25: 32.5000,
  k26: 49.0000,
  k27: 65.5000,
  k28: 82.0000,
  k29: 98.5000,
  k30: 15.9000,
  k31: 32.4000,
  k32: 48.9000,
  k33: 65.4000,
  k34: 81.9000,
  k35: 98.4000,
  k36: 15.8000,
  k37: 32.3000,
  k38: 48.8000,
  k39: 65.3000,
  k40: 81.8000,
  k41: 98.3000,
  k42: 15.7000,
  k43: 32.2000,
  k44: 48.7000,
  k45: 65.2000,
  k46: 81.7000,
  k47: 98.2000,
  k48: 15.6000,
  k49: 32.1000,
  k50: 48.6000,
  k51: 65.1000,
  k52: 81.6000,
  k53: 98.1000,
  k54: 15.5000,
  k55: 32.0000,
  k56: 48.5000,
  k57: 65.0000,
  k58: 81.5000,
  k59: 98.0000,
  k60: 15.4000,
  k61: 31.9000,
  k62: 48.4000,
  k63: 64.9000,
  k64: 81.4000,
  k65: 97.9000,
  k66: 15.3000,
  k67: 31.8000,
  k68: 48.3000,
  k69: 64.8000,
  k70: 81.3000,
  k71: 97.8000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_138_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_138_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_138_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_138_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_138_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_138_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_138_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_138_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_138_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_138_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_138_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_138_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
