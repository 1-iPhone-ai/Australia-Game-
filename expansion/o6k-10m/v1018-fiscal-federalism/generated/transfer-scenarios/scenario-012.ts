import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 012 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_012_META = {
  id: 'transfer_012',
  regionId: 'SA' as V1018FfedRegionId,
  primarySystem: 'water' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 10565,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_012_COEF = {
  k0: 62.1000,
  k1: 28.5000,
  k2: 94.0000,
  k3: 60.4000,
  k4: 26.8000,
  k5: 92.3000,
  k6: 58.7000,
  k7: 25.1000,
  k8: 90.6000,
  k9: 57.0000,
  k10: 23.4000,
  k11: 88.9000,
  k12: 55.3000,
  k13: 21.7000,
  k14: 87.2000,
  k15: 53.6000,
  k16: 20.0000,
  k17: 85.5000,
  k18: 51.9000,
  k19: 18.3000,
  k20: 83.8000,
  k21: 50.2000,
  k22: 16.6000,
  k23: 82.1000,
  k24: 48.5000,
  k25: 14.9000,
  k26: 80.4000,
  k27: 46.8000,
  k28: 13.2000,
  k29: 78.7000,
  k30: 45.1000,
  k31: 11.5000,
  k32: 77.0000,
  k33: 43.4000,
  k34: 9.8000,
  k35: 75.3000,
  k36: 41.7000,
  k37: 8.1000,
  k38: 73.6000,
  k39: 40.0000,
  k40: 6.4000,
  k41: 71.9000,
  k42: 38.3000,
  k43: 4.7000,
  k44: 70.2000,
  k45: 36.6000,
  k46: 3.0000,
  k47: 68.5000,
  k48: 34.9000,
  k49: 1.3000,
  k50: 66.8000,
  k51: 33.2000,
  k52: 98.7000,
  k53: 65.1000,
  k54: 31.5000,
  k55: 97.0000,
  k56: 63.4000,
  k57: 29.8000,
  k58: 95.3000,
  k59: 61.7000,
  k60: 28.1000,
  k61: 93.6000,
  k62: 60.0000,
  k63: 26.4000,
  k64: 91.9000,
  k65: 58.3000,
  k66: 24.7000,
  k67: 90.2000,
  k68: 56.6000,
  k69: 23.0000,
  k70: 88.5000,
  k71: 54.9000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_012_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_012_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_012_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_012_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_012_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_012_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_012_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_012_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_012_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_012_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_012_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_012_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
