import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 157 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_157_META = {
  id: 'transfer_157',
  regionId: 'TAS' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 137730,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_157_COEF = {
  k0: 85.8000,
  k1: 83.9000,
  k2: 82.0000,
  k3: 80.1000,
  k4: 78.2000,
  k5: 76.3000,
  k6: 74.4000,
  k7: 72.5000,
  k8: 70.6000,
  k9: 68.7000,
  k10: 66.8000,
  k11: 64.9000,
  k12: 63.0000,
  k13: 61.1000,
  k14: 59.2000,
  k15: 57.3000,
  k16: 55.4000,
  k17: 53.5000,
  k18: 51.6000,
  k19: 49.7000,
  k20: 47.8000,
  k21: 45.9000,
  k22: 44.0000,
  k23: 42.1000,
  k24: 40.2000,
  k25: 38.3000,
  k26: 36.4000,
  k27: 34.5000,
  k28: 32.6000,
  k29: 30.7000,
  k30: 28.8000,
  k31: 26.9000,
  k32: 25.0000,
  k33: 23.1000,
  k34: 21.2000,
  k35: 19.3000,
  k36: 17.4000,
  k37: 15.5000,
  k38: 13.6000,
  k39: 11.7000,
  k40: 9.8000,
  k41: 7.9000,
  k42: 6.0000,
  k43: 4.1000,
  k44: 2.2000,
  k45: 0.3000,
  k46: 97.5000,
  k47: 95.6000,
  k48: 93.7000,
  k49: 91.8000,
  k50: 89.9000,
  k51: 88.0000,
  k52: 86.1000,
  k53: 84.2000,
  k54: 82.3000,
  k55: 80.4000,
  k56: 78.5000,
  k57: 76.6000,
  k58: 74.7000,
  k59: 72.8000,
  k60: 70.9000,
  k61: 69.0000,
  k62: 67.1000,
  k63: 65.2000,
  k64: 63.3000,
  k65: 61.4000,
  k66: 59.5000,
  k67: 57.6000,
  k68: 55.7000,
  k69: 53.8000,
  k70: 51.9000,
  k71: 50.0000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_157_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_157_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_157_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_157_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_157_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_157_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_157_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_157_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_157_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_157_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_157_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_157_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
