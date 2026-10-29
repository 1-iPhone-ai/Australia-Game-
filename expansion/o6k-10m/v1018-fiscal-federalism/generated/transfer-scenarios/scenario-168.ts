import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 168 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_168_META = {
  id: 'transfer_168',
  regionId: 'NSW' as V1018FfedRegionId,
  primarySystem: 'telecom' as V1018FfedSystemDomain,
  transferBand: 'critical' as V1018FfedTransferBand,
  seed: 147377,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_168_COEF = {
  k0: 0.8000,
  k1: 71.7000,
  k2: 43.5000,
  k3: 15.3000,
  k4: 86.2000,
  k5: 58.0000,
  k6: 29.8000,
  k7: 1.6000,
  k8: 72.5000,
  k9: 44.3000,
  k10: 16.1000,
  k11: 87.0000,
  k12: 58.8000,
  k13: 30.6000,
  k14: 2.4000,
  k15: 73.3000,
  k16: 45.1000,
  k17: 16.9000,
  k18: 87.8000,
  k19: 59.6000,
  k20: 31.4000,
  k21: 3.2000,
  k22: 74.1000,
  k23: 45.9000,
  k24: 17.7000,
  k25: 88.6000,
  k26: 60.4000,
  k27: 32.2000,
  k28: 4.0000,
  k29: 74.9000,
  k30: 46.7000,
  k31: 18.5000,
  k32: 89.4000,
  k33: 61.2000,
  k34: 33.0000,
  k35: 4.8000,
  k36: 75.7000,
  k37: 47.5000,
  k38: 19.3000,
  k39: 90.2000,
  k40: 62.0000,
  k41: 33.8000,
  k42: 5.6000,
  k43: 76.5000,
  k44: 48.3000,
  k45: 20.1000,
  k46: 91.0000,
  k47: 62.8000,
  k48: 34.6000,
  k49: 6.4000,
  k50: 77.3000,
  k51: 49.1000,
  k52: 20.9000,
  k53: 91.8000,
  k54: 63.6000,
  k55: 35.4000,
  k56: 7.2000,
  k57: 78.1000,
  k58: 49.9000,
  k59: 21.7000,
  k60: 92.6000,
  k61: 64.4000,
  k62: 36.2000,
  k63: 8.0000,
  k64: 78.9000,
  k65: 50.7000,
  k66: 22.5000,
  k67: 93.4000,
  k68: 65.2000,
  k69: 37.0000,
  k70: 8.8000,
  k71: 79.7000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_168_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_168_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_168_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_168_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_168_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_168_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_168_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_168_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_168_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_168_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_168_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_168_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
