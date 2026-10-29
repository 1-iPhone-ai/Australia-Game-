import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 052 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_052_META = {
  id: 'transfer_052',
  regionId: 'SA' as V1018FfedRegionId,
  primarySystem: 'water' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 45645,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_052_COEF = {
  k0: 41.3000,
  k1: 47.2000,
  k2: 53.1000,
  k3: 59.0000,
  k4: 64.9000,
  k5: 70.8000,
  k6: 76.7000,
  k7: 82.6000,
  k8: 88.5000,
  k9: 94.4000,
  k10: 1.2000,
  k11: 7.1000,
  k12: 13.0000,
  k13: 18.9000,
  k14: 24.8000,
  k15: 30.7000,
  k16: 36.6000,
  k17: 42.5000,
  k18: 48.4000,
  k19: 54.3000,
  k20: 60.2000,
  k21: 66.1000,
  k22: 72.0000,
  k23: 77.9000,
  k24: 83.8000,
  k25: 89.7000,
  k26: 95.6000,
  k27: 2.4000,
  k28: 8.3000,
  k29: 14.2000,
  k30: 20.1000,
  k31: 26.0000,
  k32: 31.9000,
  k33: 37.8000,
  k34: 43.7000,
  k35: 49.6000,
  k36: 55.5000,
  k37: 61.4000,
  k38: 67.3000,
  k39: 73.2000,
  k40: 79.1000,
  k41: 85.0000,
  k42: 90.9000,
  k43: 96.8000,
  k44: 3.6000,
  k45: 9.5000,
  k46: 15.4000,
  k47: 21.3000,
  k48: 27.2000,
  k49: 33.1000,
  k50: 39.0000,
  k51: 44.9000,
  k52: 50.8000,
  k53: 56.7000,
  k54: 62.6000,
  k55: 68.5000,
  k56: 74.4000,
  k57: 80.3000,
  k58: 86.2000,
  k59: 92.1000,
  k60: 98.0000,
  k61: 4.8000,
  k62: 10.7000,
  k63: 16.6000,
  k64: 22.5000,
  k65: 28.4000,
  k66: 34.3000,
  k67: 40.2000,
  k68: 46.1000,
  k69: 52.0000,
  k70: 57.9000,
  k71: 63.8000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_052_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_052_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_052_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_052_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_052_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_052_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_052_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_052_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_052_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_052_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_052_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_052_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
