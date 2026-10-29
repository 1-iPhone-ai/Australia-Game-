import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 107 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_107_META = {
  id: 'transfer_107',
  regionId: 'WA' as V1018FfedRegionId,
  primarySystem: 'industrial' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 93880,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_107_COEF = {
  k0: 12.7000,
  k1: 85.3000,
  k2: 58.8000,
  k3: 32.3000,
  k4: 5.8000,
  k5: 78.4000,
  k6: 51.9000,
  k7: 25.4000,
  k8: 98.0000,
  k9: 71.5000,
  k10: 45.0000,
  k11: 18.5000,
  k12: 91.1000,
  k13: 64.6000,
  k14: 38.1000,
  k15: 11.6000,
  k16: 84.2000,
  k17: 57.7000,
  k18: 31.2000,
  k19: 4.7000,
  k20: 77.3000,
  k21: 50.8000,
  k22: 24.3000,
  k23: 96.9000,
  k24: 70.4000,
  k25: 43.9000,
  k26: 17.4000,
  k27: 90.0000,
  k28: 63.5000,
  k29: 37.0000,
  k30: 10.5000,
  k31: 83.1000,
  k32: 56.6000,
  k33: 30.1000,
  k34: 3.6000,
  k35: 76.2000,
  k36: 49.7000,
  k37: 23.2000,
  k38: 95.8000,
  k39: 69.3000,
  k40: 42.8000,
  k41: 16.3000,
  k42: 88.9000,
  k43: 62.4000,
  k44: 35.9000,
  k45: 9.4000,
  k46: 82.0000,
  k47: 55.5000,
  k48: 29.0000,
  k49: 2.5000,
  k50: 75.1000,
  k51: 48.6000,
  k52: 22.1000,
  k53: 94.7000,
  k54: 68.2000,
  k55: 41.7000,
  k56: 15.2000,
  k57: 87.8000,
  k58: 61.3000,
  k59: 34.8000,
  k60: 8.3000,
  k61: 80.9000,
  k62: 54.4000,
  k63: 27.9000,
  k64: 1.4000,
  k65: 74.0000,
  k66: 47.5000,
  k67: 21.0000,
  k68: 93.6000,
  k69: 67.1000,
  k70: 40.6000,
  k71: 14.1000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_107_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_107_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_107_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_107_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_107_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_107_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_107_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_107_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_107_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_107_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_107_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_107_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
